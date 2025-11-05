import React, { useState } from 'react';

function AuthHero () {
    return (
        <div className="flex-1 bg-gradient-to-br from-[#07767c] via-[#055a5f] to-[#043d42] text-white p-12 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32 transition-transform duration-700 hover:scale-110"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mb-24 transition-transform duration-700 hover:scale-110"></div>

            <div className="relative z-10 space-y-6 animate-[fadeIn_0.5s_ease-out]">
                <h2 className="text-4xl font-bold mb-6 leading-tight">
                    Únete a la Comunidad Busquidy
                </h2>
                <p className="text-white/90 mb-8 text-lg">
                    Comienza a conectar, colaborar y crecer profesionalmente.
                </p>
                <ul className="space-y-4">
                    {[
                        "Crea tu perfil profesional en minutos",
                        "Postula a proyectos innovadores",
                        "Encuentra el talento ideal para tu empresa"
                    ].map((item, index) => (
                        <li 
                            key={index} 
                            className="flex items-center gap-3 text-lg opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                            style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                        >
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
};

export default AuthHero;