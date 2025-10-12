import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import '../../styles/Home/FAQSection.css';

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        { question: '¿Por qué debería contratar a un freelancer?', answer: 'Contratar a un freelancer te permite flexibilidad...' },
        { question: '¿En qué se diferencia Busquidy de otras plataformas?', answer: 'Busquidy se enfoca en un servicio premium...' },
        { question: '¿Cuánto cuesta registrarse?', answer: 'Registrarse en Busquidy es completamente gratis...' },
        { question: '¿Cómo puedo comunicarme con mi freelancer?', answer: 'Puedes comunicarte a través del chat integrado...' },
        { question: '¿Qué métodos de pago ofrece Busquidy?', answer: 'Ofrecemos pagos a través de tarjetas de crédito, PayPal...' },
        { question: '¿Cómo sé que recibiré el trabajo?', answer: 'Busquidy garantiza que recibirás el trabajo o tu dinero de vuelta...' },
        { question: '¿Qué debo hacer si tengo problemas con un freelancer?', answer: 'Contáctanos a través de soporte para resolver cualquier conflicto...' },
        { question: '¿Puedo trabajar con freelancers de habla hispana?', answer: 'Sí, en Busquidy puedes filtrar freelancers por idioma.' }
    ];

    return (
        <div className="w-full max-w-[800px] mx-auto p-5">
            <h2 className="text-3xl mb-5 text-left font-bold text-gray-800">
                Preguntas Frecuentes <i className="bi bi-question-circle"></i>
            </h2>
            
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className="border-b border-gray-300 py-4"
                >
                    <div 
                        className="flex justify-between text-lg cursor-pointer select-none text-teal-900"
                        onClick={() => toggleFAQ(index)}
                    >
                        <span>{faq.question}</span>
                        <span className="text-2xl font-bold">
                            {activeIndex === index ? '−' : '+'}
                        </span>
                    </div>
                    <div 
                        className={`overflow-hidden text-base text-gray-600 transition-all duration-400 ${
                            activeIndex === index 
                                ? 'max-h-[500px] opacity-100 mt-3' 
                                : 'max-h-0 opacity-0 mt-0'
                        }`}
                    >
                        {faq.answer}
                    </div>
                </div>
            ))}
            
            <p className="text-center mt-5">
                ¿Tienes una pregunta diferente? Puedes consultar{' '}
                <Link 
                    className={`text-green-500 no-underline inline py-2.5 px-0 border-b border-[#ddd] last:border-b-0`}
                    to="/soporteHome"
                >
                    aquí
                </Link>
            </p>
        </div>
    );
};

export default FAQSection;