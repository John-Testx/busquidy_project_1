import React from "react";
// import '../../styles/Home/CardSection.css';
import { Link } from "react-router-dom";

function CardSection({ userType }) {
    return (
        <div className="flex flex-col md:flex-row justify-evenly items-center py-20 px-5 bg-gradient-to-l from-teal-100 via-teal-50 to-white border border-transparent">
            {/* Tarjeta FreeLancer */}
            <div className="bg-white w-full md:w-[350px] my-5 md:mx-5 px-5 py-8 text-center shadow-lg rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <h2 className="text-3xl mb-5 text-teal-700 font-bold border-b border-teal-700 pb-2 mb-3">
                    FREELANCER
                </h2>
                <p className="text-lg mb-5 leading-relaxed text-gray-800">
                    Busca proyectos o tareas de tu interés, publica tu CV y muestra tu perfil a las empresas.
                </p>
                <Link to="/freelancer">
                    <button className="bg-teal-700 text-white border-none cursor-pointer py-3 px-6 rounded-full text-base font-semibold transition-all duration-300 shadow-md hover:bg-teal-800 hover:scale-105">
                        {userType === "freelancer" ? "Ingresar" : "Ser FreeLancer"}
                    </button>
                </Link>
            </div>

            {/* Tarjeta Empresa */}
            <div className="bg-white w-full md:w-[350px] my-5 md:mx-5 px-5 py-8 text-center shadow-lg rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <h2 className="text-3xl mb-5 text-teal-700 font-bold border-b border-teal-700 pb-2 mb-3">
                    EMPRESA
                </h2>
                <p className="text-lg mb-5 leading-relaxed text-gray-800">
                    Publica proyectos y/o busca freelancers para que realicen tus proyectos.
                </p>
                <Link to="/empresa">
                    <button className="bg-teal-700 text-white border-none cursor-pointer py-3 px-6 rounded-full text-base font-semibold transition-all duration-300 shadow-md hover:bg-teal-800 hover:scale-105">
                        {userType === "empresa" ? "Ingresar" : "Ser Empresa"}
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default CardSection;