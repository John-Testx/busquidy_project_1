import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes"; // Import the new AppRoutes component
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hooks";
import io from "socket.io-client";

//** WAZA raza no pesquen este mensaje =U */

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
    <Router basename={import.meta.env.BASE_URL} >
      <div className="h-full w-full">
          <AppRoutes />
      </div>
    </Router>
  );
}

export default App;