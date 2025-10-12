import React, { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, Shield, Zap, Target, Award, ChevronRight, CheckCircle, Code, TrendingUp, Building } from "lucide-react";
import Navbar from "../../components/Home/Navbar";
//import NavbarEmpresa from "../../components/Empresa/NavbarEmpresa";
//import NavbarFreeLancer from "../../components/FreeLancer/NavbarFreeLancer";
import Footer from "../../components/Home/Footer";
import LoadingScreen from "../../components/LoadingScreen"; 
import useAuth from "../../hooks/useAuth";

function AboutUsPage() {
    const [logoutStatus, setLogoutStatus] = useState("");
    const navigate = useNavigate(); 

     const founders = [
        {
            name: "Juan Alonso Astudillo Murúa",
            role: "Co-Founder & CTO",
            title: "Chief Technology Officer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Markostoesx",
            description: "Líder en arquitectura tecnológica y desarrollo de plataforma"
        },
        {
            name: "Felipe Andrés Quiñehual Monsalve",
            role: "Co-Founder & COO",
            title: "Chief Operations Officer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Landon",
            description: "Experto en operaciones y estrategia de negocio"
        },
        {
            name: "Francisco Daniel Riquelme Miranda",
            role: "Co-Founder & CPO",
            title: "Chief Product Officer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Belisario",
            description: "Visionario del producto y experiencia de usuario"
        }
    ];

    const stats = [
        { number: "5,000+", label: "Estudiantes Activos", icon: Users },
        { number: "500+", label: "PYMEs Conectadas", icon: Building },
        { number: "10,000+", label: "Proyectos Completados", icon: Briefcase },
        { number: "98%", label: "Satisfacción", icon: Award }
    ];

    const values = [
        {
            icon: Shield,
            title: "Confianza y Transparencia",
            description: "Implementamos mecanismos rigurosos de verificación y un sistema integral de calificaciones para garantizar seguridad en cada transacción."
        },
        {
            icon: Zap,
            title: "Innovación",
            description: "Construido con tecnología robusta, integrando pagos seguros, herramientas de comunicación y futuras implementaciones de IA."
        },
        {
            icon: Target,
            title: "Flexibilidad e Inclusión",
            description: "Fomentamos una red colaborativa que prioriza oportunidades compatibles con los horarios académicos de los estudiantes."
        }
    ];


    // Usar hook centralizado
    const { isAuthenticated, tipo_usuario: userType, loading, logout } = useAuth();

    return (
        <div style={{ marginTop: "80px" }}>
            {/* Pantalla de carga */}
            {loading && <LoadingScreen />}
            <Navbar />

            <div className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
                        <div className="text-center">
                            <h1 className="text-5xl font-bold text-gray-900 mb-6">
                                Sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Busquidy</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Conectando el talento universitario con las oportunidades del futuro
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Nuestra Misión: <span className="text-blue-600">Cerrando la Brecha del Talento</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Busquidy fue fundada con la convicción de que existe una brecha estructural entre el vasto talento de los estudiantes universitarios y las necesidades dinámicas de las PYMEs, emprendedores e individuos que requieren apoyo flexible y confiable.
                            </p>
                            <p className="text-lg text-gray-600 mb-8">
                                Nuestra misión es ser la <strong className="text-gray-900">"Bolsa Única de Servicios"</strong> que resuelve este desafío proporcionando un espacio digital seguro, accesible y eficiente.
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-8 mt-12">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-blue-600 text-white rounded-lg p-3">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 mb-2">Para Estudiantes</h3>
                                            <p className="text-gray-700">
                                                Democratizamos el acceso a oportunidades de trabajo flexible y micro-proyectos que les permiten ganar experiencia práctica crucial y generar ingresos sin comprometer sus estudios.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-purple-600 text-white rounded-lg p-3">
                                            <Building className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 mb-2">Para Empresas (PYMEs)</h3>
                                            <p className="text-gray-700">
                                                Ofrecemos una forma simple y rentable de conectar directamente con talento calificado emergente para tareas específicas, proyectos o demandas a corto plazo.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg mb-4">
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                                    <div className="text-white/80 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                La Diferencia Busquidy: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Confianza y Tecnología</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Nuestra plataforma está diseñada para superar los desafíos de la informalidad y la inseguridad que a menudo se encuentran en el mercado laboral.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            {values.map((value, index) => (
                                <div key={index} className="group hover:scale-105 transition-transform duration-300">
                                    <div className="bg-white rounded-xl shadow-lg p-8 h-full border border-gray-100 hover:shadow-2xl transition-shadow">
                                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg p-3 w-fit mb-6">
                                            <value.icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                                        <p className="text-gray-600">{value.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Founders Section */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Conoce a Nuestros Fundadores</h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Busquidy fue iniciado como un proyecto innovador por tres estudiantes del programa de Tecnología de la Información y Ciberseguridad, motivados por la necesidad de desarrollar soluciones tecnológicas innovadoras para contribuir al mercado laboral chileno.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            {founders.map((founder, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8">
                                        <img 
                                            src={founder.image} 
                                            alt={founder.name}
                                            className="w-32 h-32 rounded-full bg-white mx-auto border-4 border-white shadow-lg"
                                        />
                                    </div>
                                    <div className="p-6 text-center">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{founder.name}</h3>
                                        <p className="text-blue-600 font-semibold mb-2">{founder.role}</p>
                                        <p className="text-sm text-gray-500 mb-3">{founder.title}</p>
                                        <p className="text-gray-600 text-sm">{founder.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
                            <h2 className="text-3xl font-bold mb-4">¿Listo para unirte a Busquidy?</h2>
                            <p className="text-xl mb-8 text-white/90">
                                Sé parte de la revolución que está transformando el mercado laboral chileno
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button 
                                    onClick={() => console.log('Navigate to /registro')}
                                    className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    Comienza Ahora <ChevronRight className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => console.log('Navigate to /contacto')}
                                    className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    Contáctanos
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />

            {/* Mensaje de estado de cierre de sesión */}
            {logoutStatus && (
                <div className="logout-status-msg">
                    {logoutStatus}
                </div>
            )}
        </div>
    );
}

export default AboutUsPage;