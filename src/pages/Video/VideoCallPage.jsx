import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// Importación de todos los íconos necesarios
import {
    FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash,
    FaPhoneSlash, FaDesktop, FaPaperPlane, FaComment, FaCommentSlash
} from 'react-icons/fa';

const VideoCallPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const myVideoRef = useRef(null);
    const [peers, setPeers] = useState({});
    const socketRef = useRef(null);
    const myPeerConnections = useRef({});
    const myStream = useRef(null);
    const screenTrackRef = useRef(null);
    const myDataChannels = useRef({});

    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showChat, setShowChat] = useState(false);

    // Tu función para configurar los listeners del DataChannel (sin cambios)
    const setupDataChannelListeners = (dataChannel, targetUserId) => {
        dataChannel.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'chat-message') {
                    setMessages(prev => [...prev, { sender: targetUserId, message: data.message, isLocal: false }]);
                }
            } catch (e) { console.error("Error al parsear mensaje de DataChannel:", e); }
        };
        dataChannel.onopen = () => console.log(`✅ DataChannel con ${targetUserId} abierto.`);
        dataChannel.onclose = () => {
            console.log(`❌ DataChannel con ${targetUserId} cerrado.`);
            delete myDataChannels.current[targetUserId];
        };
        dataChannel.onerror = (error) => console.error(`Error en DataChannel con ${targetUserId}:`, error);
    };

    // Tu función para crear el Peer Connection (sin cambios)
    const createPeerConnection = (targetUserId, isInitiator = false) => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        myStream.current.getTracks().forEach(track => peerConnection.addTrack(track, myStream.current));
        peerConnection.ontrack = (event) => setPeers(prev => ({ ...prev, [targetUserId]: event.streams[0] }));
        peerConnection.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit('ice-candidate', { target: targetUserId, candidate: event.candidate });
            }
        };
        if (isInitiator) {
            const dataChannel = peerConnection.createDataChannel("chat");
            myDataChannels.current[targetUserId] = dataChannel;
            setupDataChannelListeners(dataChannel, targetUserId);
        }
        myPeerConnections.current[targetUserId] = peerConnection;
        return peerConnection;
    };

    // === EFECTO PRINCIPAL CORREGIDO Y ROBUSTO ===
    useEffect(() => {
        // Usa tu IP correcta para asegurar la conexión
        socketRef.current = io("http://192.168.1.21:3001");
        const socket = socketRef.current; // Usar una variable local para la limpieza

        // --- MANEJADORES DE EVENTOS DE SOCKET (Definidos afuera) ---
        const handleUserConnected = (newUserId) => {
            const peerConnection = createPeerConnection(newUserId, true); // isInitiator = true
            peerConnection.createOffer()
                .then(offer => peerConnection.setLocalDescription(offer))
                .then(() => socket.emit('offer', { target: newUserId, sdp: peerConnection.localDescription }));
        };

        const handleOffer = (payload) => {
            const peerConnection = createPeerConnection(payload.source, false); // isInitiator = false
            peerConnection.ondatachannel = (event) => {
                const receivedDataChannel = event.channel;
                myDataChannels.current[payload.source] = receivedDataChannel;
                setupDataChannelListeners(receivedDataChannel, payload.source);
            };
            peerConnection.setRemoteDescription(new RTCSessionDescription(payload.sdp))
                .then(() => peerConnection.createAnswer())
                .then(answer => peerConnection.setLocalDescription(answer))
                .then(() => socket.emit('answer', { target: payload.source, sdp: peerConnection.localDescription }));
        };

        const handleAnswer = (payload) => {
            const pc = myPeerConnections.current[payload.source];
            if (pc) pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        };

        const handleIceCandidate = (payload) => {
            const pc = myPeerConnections.current[payload.source];
            if (pc) pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
        };

        const handleUserDisconnected = (userId) => {
            if (myPeerConnections.current[userId]) myPeerConnections.current[userId].close();
            delete myPeerConnections.current[userId];
            if (myDataChannels.current[userId]) myDataChannels.current[userId].close();
            delete myDataChannels.current[userId];
            setPeers(prev => { const newPeers = { ...prev }; delete newPeers[userId]; return newPeers; });
        };

        const handleRoomFull = () => {
            alert('La sala de reunión está llena. Solo se permiten 2 participantes.');
            navigate('/my-calls');
        };
        
        // --- INICIO Y LIMPIEZA ---
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                myStream.current = stream;
                if (myVideoRef.current) myVideoRef.current.srcObject = stream;

                // Registrar todos los listeners una sola vez
                socket.on('user-connected', handleUserConnected);
                socket.on('offer', handleOffer);
                socket.on('answer', handleAnswer);
                socket.on('ice-candidate', handleIceCandidate);
                socket.on('user-disconnected', handleUserDisconnected);
                socket.on('room-full', handleRoomFull);

                // Solo ahora nos unimos a la sala
                socket.emit('join-video-room', roomId, socket.id);
            })
            .catch(error => {
                console.error("Error al obtener acceso a los medios:", error);
                alert("No se pudo acceder a la cámara y al micrófono. Por favor, verifica los permisos.");
            });

        return () => {
            console.log("Limpiando todo...");
            if (socket) {
                // Quitamos los listeners para evitar fugas de memoria y bugs en desarrollo
                socket.off('user-connected', handleUserConnected);
                socket.off('offer', handleOffer);
                socket.off('answer', handleAnswer);
                socket.off('ice-candidate', handleIceCandidate);
                socket.off('user-disconnected', handleUserDisconnected);
                socket.off('room-full', handleRoomFull);
                socket.disconnect();
            }
            if (myStream.current) myStream.current.getTracks().forEach(track => track.stop());
            Object.values(myPeerConnections.current).forEach(pc => pc.close());
            Object.values(myDataChannels.current).forEach(dc => dc.close());
        };
    }, [roomId, navigate]); // Añadimos 'navigate' a las dependencias


    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const chatMessage = { type: 'chat-message', message: newMessage.trim() };
            const messageString = JSON.stringify(chatMessage);
            
            Object.values(myDataChannels.current).forEach(dc => {
                if (dc.readyState === 'open') dc.send(messageString);
            });

            setMessages(prev => [...prev, { sender: 'Tú', message: newMessage.trim(), isLocal: true }]);
            setNewMessage('');
        }
    };
    
    // --- Resto de funciones (sin cambios) ---
       const toggleScreenShare = async () => {
        if (isSharingScreen) {
            const cameraTrack = myStream.current.getVideoTracks()[0];
            Object.values(myPeerConnections.current).forEach(peerConnection => {
                const sender = peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
                if (sender) sender.replaceTrack(cameraTrack);
            });
            screenTrackRef.current.stop();
            myVideoRef.current.srcObject = myStream.current;
            setIsSharingScreen(false);
        } else {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
                const screenTrack = screenStream.getVideoTracks()[0];
                screenTrackRef.current = screenTrack;

                Object.values(myPeerConnections.current).forEach(peerConnection => {
                    const sender = peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
                    if (sender) sender.replaceTrack(screenTrack);
                });

                myVideoRef.current.srcObject = screenStream;
                setIsSharingScreen(true);

                screenTrack.onended = () => {
                    if(screenTrackRef.current && screenTrackRef.current.readyState === 'ended') {
                        toggleScreenShare();
                    }
                };
            } catch (error) {
                console.error("Error al compartir pantalla:", error);
            }
        }
    };
    const toggleMic = () => {
        myStream.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        setMicOn(!micOn);
    };
    const toggleCamera = () => {
        if(isSharingScreen) return;
        myStream.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        setCameraOn(!cameraOn);
    };

    const hangUp = () => {
        navigate('/my-calls');
    };
    // === LÓGICA PARA EL DISEÑO DINÁMICO ===
    const numPeers = Object.keys(peers).length;

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            <div className="flex-1 flex flex-col relative">
                
                <div className={`flex-grow p-4 transition-all duration-500 ${numPeers === 0 ? 'flex justify-center items-center' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
                    <div className={`relative bg-black rounded-lg overflow-hidden shadow-lg transition-all duration-500 ${numPeers === 0 ? 'w-full max-w-4xl h-full max-h-[75vh]' : 'w-full h-full'}`}>
                        <video ref={myVideoRef} autoPlay muted playsInline className="w-full h-full object-contain" />
                        <p className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">Tú</p>
                    </div>

                    {Object.keys(peers).map(peerId => (
                        <div key={peerId} className="relative bg-black rounded-lg overflow-hidden shadow-lg w-full h-full">
                            <video autoPlay playsInline ref={node => { if (node) node.srcObject = peers[peerId]; }} className="w-full h-full object-contain" />
                            <p className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">Usuario {peerId.substring(0, 6)}</p>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 flex justify-center items-center p-4 space-x-4 z-20">
                    <button onClick={toggleMic} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">{micOn ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} className="text-red-500" />}</button>
                    <button onClick={toggleCamera} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50" disabled={isSharingScreen}>{cameraOn ? <FaVideo size={24} /> : <FaVideoSlash size={24} className="text-red-500" />}</button>
                    <button onClick={hangUp} className="p-3 rounded-full bg-red-600 hover:bg-red-700"><FaPhoneSlash size={24} /></button>
                    <button onClick={toggleScreenShare} className={`p-3 rounded-full ${isSharingScreen ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-gray-600`}><FaDesktop size={24} /></button>
                </div>

                <button onClick={() => setShowChat(!showChat)} className="absolute top-4 right-4 bg-gray-700 p-3 rounded-full hover:bg-gray-600 z-30">
                    {showChat ? <FaCommentSlash /> : <FaComment />}
                </button>
            </div>

            <div className={`w-80 bg-gray-800 flex flex-col transition-transform duration-300 transform ${showChat ? 'translate-x-0' : 'translate-x-full'} absolute right-0 top-0 h-full z-20 md:relative md:translate-x-0`}>
                <div className="p-4 border-b border-gray-700 text-center font-bold">Chat de la Reunión (P2P)</div>
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className="mb-2 break-words">
                            <span className={`font-bold ${msg.isLocal ? 'text-green-400' : 'text-blue-400'}`}>
                                {msg.sender === 'Tú' ? 'Tú' : `Usuario ${msg.sender.substring(0, 6)}`}:
                            </span>
                            <span> {msg.message}</span>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex">
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Escribe un mensaje..." className="flex-1 bg-gray-700 rounded-l-md p-2 outline-none text-white" />
                    <button type="submit" className="bg-blue-600 rounded-r-md px-4 hover:bg-blue-700"><FaPaperPlane /></button>
                </form>
            </div>
        </div>
    );
};

export default VideoCallPage;