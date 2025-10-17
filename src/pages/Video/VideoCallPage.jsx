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
    const socketRef = useRef(null); // <--- Usaremos este ref para acceder al socket
    const myPeerConnections = useRef({});
    const myStream = useRef(null);
    const screenTrackRef = useRef(null);

    // ... (todos los useState permanecen igual) ...
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showChat, setShowChat] = useState(false);


    useEffect(() => {
        // Se crea la instancia del socket y se guarda en el ref
        socketRef.current = io("http://localhost:3001"); // IMPORTANTE: Usa tu IP correcta

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                myStream.current = stream;
                if (myVideoRef.current) myVideoRef.current.srcObject = stream;

                const userId = socketRef.current.id;
                socketRef.current.emit('join-video-room', roomId, userId);

                socketRef.current.on('user-connected', (newUserId) => {
                    // Pasamos el socket del ref a la función
                    const peerConnection = createPeerConnection(newUserId, socketRef.current);
                    peerConnection.createOffer()
                        .then(offer => peerConnection.setLocalDescription(offer))
                        .then(() => {
                            socketRef.current.emit('offer', { target: newUserId, sdp: peerConnection.localDescription });
                        });
                });

                socketRef.current.on('offer', (payload) => {
                    const peerConnection = createPeerConnection(payload.source, socketRef.current);
                    peerConnection.setRemoteDescription(new RTCSessionDescription(payload.sdp))
                        .then(() => peerConnection.createAnswer())
                        .then(answer => peerConnection.setLocalDescription(answer))
                        .then(() => {
                            socketRef.current.emit('answer', { target: payload.source, sdp: peerConnection.localDescription });
                        });
                });

                // ... (el resto de los listeners 'answer', 'ice-candidate', 'user-disconnected' usan socketRef.current y están bien)
                 socketRef.current.on('answer', (payload) => {
                  const peerConnection = myPeerConnections.current[payload.source];
                  if (peerConnection) {
                    peerConnection.setRemoteDescription(new RTCSessionDescription(payload.sdp));
                  }
                });
                socketRef.current.on('ice-candidate', (payload) => {
                  const peerConnection = myPeerConnections.current[payload.source];
                  if (peerConnection) {
                    peerConnection.addIceCandidate(new RTCIceCandidate(payload.candidate));
                  }
                });
                socketRef.current.on('user-disconnected', (userId) => {
                  if (myPeerConnections.current[userId]) {
                      myPeerConnections.current[userId].close();
                      delete myPeerConnections.current[userId];
                  }
                  setPeers(prevPeers => {
                      const newPeers = { ...prevPeers };
                      delete newPeers[userId];
                      return newPeers;
                  });
                });


                socketRef.current.on('receive-chat-message', (data) => {
                    setMessages(prevMessages => [...prevMessages, data]);
                });
            })
            .catch(error => {
                console.error("Error al obtener acceso a los medios:", error);
                alert("No se pudo acceder a la cámara y al micrófono. Por favor, verifica los permisos.");
            });

        // La función de limpieza ahora es más simple
        return () => {
            console.log("Limpiando y desconectando socket...");
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if(myStream.current) myStream.current.getTracks().forEach(track => track.stop());
            Object.values(myPeerConnections.current).forEach(pc => pc.close());
        };
    }, [roomId]);

    const createPeerConnection = (targetUserId, socket) => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        myStream.current.getTracks().forEach(track => {
            peerConnection.addTrack(track, myStream.current);
        });

        peerConnection.ontrack = (event) => {
            setPeers(prevPeers => ({ ...prevPeers, [targetUserId]: event.streams[0] }));
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', { target: targetUserId, candidate: event.candidate });
            }
        };

        myPeerConnections.current[targetUserId] = peerConnection;
        return peerConnection;
    };

    // =====> FUNCIÓN CORREGIDA <=====
    const handleSendMessage = (e) => {
        e.preventDefault();
        // Usa el socket que ya existe en el ref, en lugar de crear uno nuevo
        if (newMessage.trim() && socketRef.current) {
            socketRef.current.emit('send-chat-message', newMessage);
            setNewMessage('');
        }
    };

    // ... (el resto de las funciones: toggleScreenShare, toggleMic, toggleCamera, hangUp están bien)
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

    return (
      // ... (el JSX del return está bien y no necesita cambios)
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
          <div className="flex-1 flex flex-col relative">
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
                <video ref={myVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                <p className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">Tú</p>
              </div>

              {Object.keys(peers).map(peerId => (
                <div key={peerId} className="relative bg-black rounded-lg overflow-hidden shadow-lg">
                  <video
                    autoPlay
                    playsInline
                    ref={video => { if (video) video.srcObject = peers[peerId]; }}
                    className="w-full h-full object-cover"
                  />
                   <p className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">Usuario {peerId.substring(0,6)}</p>
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 flex justify-center items-center p-4 space-x-4 z-20">
                <button onClick={toggleMic} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                    {micOn ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} className="text-red-500" />}
                </button>
                <button onClick={toggleCamera} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50" disabled={isSharingScreen}>
                    {cameraOn ? <FaVideo size={24} /> : <FaVideoSlash size={24} className="text-red-500" />}
                </button>
                <button onClick={hangUp} className="p-3 rounded-full bg-red-600 hover:bg-red-700">
                    <FaPhoneSlash size={24} />
                </button>
                <button onClick={toggleScreenShare} className={`p-3 rounded-full ${isSharingScreen ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-gray-600`}>
                    <FaDesktop size={24} />
                </button>
            </div>

            <button onClick={() => setShowChat(!showChat)} className="absolute top-4 right-4 bg-gray-700 p-3 rounded-full hover:bg-gray-600 z-30">
                {showChat ? <FaCommentSlash /> : <FaComment />}
            </button>
          </div>

          <div className={`w-80 bg-gray-800 flex flex-col transition-transform duration-300 transform ${showChat ? 'translate-x-0' : 'translate-x-full'} absolute right-0 top-0 h-full z-20 md:relative md:translate-x-0`}>
            <div className="p-4 border-b border-gray-700 text-center font-bold">
                Chat de la Reunión
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2 break-words">
                        <span className="font-bold text-blue-400">{typeof msg.sender === 'string' ? msg.sender.substring(0, 6) : 'Anónimo'}: </span>
                        <span>{msg.message}</span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-gray-700 rounded-l-md p-2 outline-none"
                />
                <button type="submit" className="bg-blue-600 rounded-r-md px-4 hover:bg-blue-700">
                    <FaPaperPlane />
                </button>
            </form>
          </div>
        </div>
    );
};

export default VideoCallPage;