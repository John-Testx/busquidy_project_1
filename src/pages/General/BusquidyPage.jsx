import React, { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hooks";
import { howItWorksSteps, joinTheChange, whatIsBusquidy, whyChooseFeatures } from "@/common/mockBusquidyInfo";
import { Footer, Navbar } from '@/components/Home/';

function BusquidyPage() {
    // Estado para los mensajes de logout
    const [logoutStatus, setLogoutStatus] = useState("");
    // Estado para el tipo de usuario: "empresa" o "freelancer"

    const navigate = useNavigate(); 

    // Usar hook centralizado
    const { isAuthenticated, tipo_usuario: userType, loading, logout } = useAuth();

    // Section texts
    const wBusquidy = whatIsBusquidy;
    const workSteps = howItWorksSteps;
    const chooseFeatures = whyChooseFeatures;
    const jTChange = joinTheChange;

    
    return (
        <div style={{ marginTop: "80px" }}>
            {/* Pantalla de carga */}
            {loading && <LoadingScreen />}

            <Navbar />;
            
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Section 1: What is Busquidy? */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Que es Busquidy?</h1>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                        {wBusquidy}
                    </p>
                </section>

                {/* Section 2: How It Works */}
                <section className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Como funciona?</h2>
                    <div className="grid md:grid-cols-5 gap-6">
                        {workSteps.map((step, index) => (
                            <div key={index} className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                    {step.number}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 3: Why Choose Busquidy? */}
                <section className="mb-16 bg-white py-12 px-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Porque escoger a Busquidy?</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chooseFeatures.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-md">
                                <span className="text-2xl flex-shrink-0 mt-1">{feature.icon}</span>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 4: Join the Change */}
                <section className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Únete al cambio!</h2>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
                        {jTChange}
                    </p>
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
                        onClick={() => navigate('/register')} // Adjust navigation as needed
                    >
                        Únete a Busquidy Hoy
                    </button>
                </section>
            </main>


            <Footer />

            {/* Mensaje de estado de cierre de sesión */}
            {logoutStatus && (
                <div className="logout-status">
                    {logoutStatus}
                </div>
            )}
        </div>
    );
}

export default BusquidyPage;
