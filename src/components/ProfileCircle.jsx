import React from "react";
import { User } from "lucide-react";

const ProfileCircle = ({ userInitials = "NN", size = "md", showBorder = true }) => {
    // Configuración de tamaños
    const sizeConfig = {
        sm: {
            circle: "w-8 h-8",
            text: "text-xs",
            icon: 14
        },
        md: {
            circle: "w-10 h-10",
            text: "text-sm",
            icon: 18
        },
        lg: {
            circle: "w-12 h-12",
            text: "text-base",
            icon: 20
        },
        xl: {
            circle: "w-16 h-16",
            text: "text-xl",
            icon: 28
        }
    };

    const config = sizeConfig[size] || sizeConfig.md;

    return (
        <div 
            className={`
                ${config.circle} 
                rounded-full 
                bg-gradient-to-br from-[#07767c] to-[#055a5f] 
                flex items-center justify-center 
                text-white font-bold 
                ${config.text}
                ${showBorder ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-100' : ''}
                shadow-lg
                cursor-pointer
                transition-all duration-300
                hover:scale-110
                hover:shadow-xl
                hover:rotate-3
                group
                relative
                overflow-hidden
            `}
        >
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Contenido */}
            <span className="relative z-10 uppercase tracking-wide">
                {userInitials || <User size={config.icon} />}
            </span>
        </div>
    );
};

export default ProfileCircle;