import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

const DesktopNav = ({ navOptions, helpDropdownOptions, isActive }) => {
    const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false);
    const helpMenuRef = useRef(null);

    // Handle click outside for help menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (helpMenuRef.current && !helpMenuRef.current.contains(event.target)) {
                setIsHelpDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="hidden lg:flex items-center space-x-1">
            {navOptions.map((opt) => (
                <Link
                    key={opt.link}
                    to={opt.link}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group ${
                        isActive(opt.link)
                            ? 'text-[#07767c] bg-[#07767c]/10'
                            : 'text-gray-700 hover:text-[#07767c] hover:bg-gray-50'
                    }`}
                >
                    {opt.label}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#07767c] transition-all duration-300 ${
                        isActive(opt.link) ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                    }`}></span>
                </Link>
            ))}

            {/* Help Dropdown */}
            <div className="relative" ref={helpMenuRef}>
                <button 
                    onClick={() => setIsHelpDropdownOpen(!isHelpDropdownOpen)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        isHelpDropdownOpen 
                            ? 'text-[#07767c] bg-[#07767c]/10' 
                            : 'text-gray-700 hover:text-[#07767c] hover:bg-gray-50'
                    }`}
                >
                    <HelpCircle size={18} />
                    <span>¡Ayuda!</span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isHelpDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isHelpDropdownOpen && (
                    <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {helpDropdownOptions.map((option, index) => (
                            <React.Fragment key={option.link}>
                                <Link 
                                    to={option.link}
                                    onClick={() => setIsHelpDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#07767c]/5 hover:text-[#07767c] transition-colors"
                                >
                                    {option.label === "Soporte al Cliente" ? <MessageSquare size={18} /> : <HelpCircle size={18} />}
                                    <span>{option.label}</span>
                                </Link>
                                {index === 0 && <div className="h-px bg-gray-100 my-1"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default DesktopNav;