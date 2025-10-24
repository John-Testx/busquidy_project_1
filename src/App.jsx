import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes"; // Import the new AppRoutes component
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hooks";
import io from "socket.io-client";

//** waza triste :c dandadan 
// Akirame no warui yakara
// Antara nanka ja taba natte mo kanawan
// Kuwabara, kuwabara, kuwabara
// Me ni mo tomaran hayasa, hey
// Kutabaran damaran
// Sagaran oshitoosu wagamama, hey
// Soko doki na jama da ore wa mou hitori no anata
// Sada-Chan, Kaya-Chan*/

function App() {
  const [connectedUsers, setConnectedUsers] = useState(0);
  const socketRef = useRef(null);
  const { loading } = useAuth(); // Use the loading state from your auth hook
  
  useEffect(() => {
    // Create socket only once
    
    //** UNCOMMENT LATER, RIGHT NOW IM TESTING THE PUBLIC URL */
    // if (!socketRef.current) {
    //   socketRef.current = io("http://localhost:3001", {
    //     transports: ["websocket"],
    //     withCredentials: true
    //   });

    //   socketRef.current.on("usersCount", (count) => {
    //     setConnectedUsers(count);
    //   });
    // }

    // return () => {
    //   if (socketRef.current) {
    //     socketRef.current.disconnect();
    //     socketRef.current = null;
    //   }
    // };
      
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

return (
    <Router basename="/" >
      <div className="h-full w-full">
          <AppRoutes />
      </div>
    </Router>
  );
}

export default App;