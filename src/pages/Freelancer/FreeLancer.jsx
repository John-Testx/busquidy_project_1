import React, { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import LittleSearchSection from "@/components/FreeLancer/PanelFreelancer/LittleSearchSection";
import LoadingScreen from "@/components/LoadingScreen";
import InfoSectionFreelancer from "@/components/FreeLancer/PanelFreelancer/InfoSectionFreelancer";
import { Footer, Navbar } from '@/components/Home/';
import { useAuth } from "@/hooks/index";


function FreeLancer() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const {loading} = useAuth();
    const [logoutStatus, setLogoutStatus] = useState("");
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();
    
    return (
        <div>
            {loading && <LoadingScreen />}
            <Navbar />;
            <LittleSearchSection/>
            <InfoSectionFreelancer/>
            <Footer/>
            
            {logoutStatus && (
                <div className="fixed bottom-4 right-4 bg-[#07767c] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-[modalSlideIn_0.3s_ease-out]">
                    {logoutStatus}
                </div>
            )}
        </div>
    );
}

export default FreeLancer;