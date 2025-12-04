import React from 'react';
import { Footer, Navbar } from '@/components/Home/';
import { Shield, Lock, Eye, FileText, Server, UserCheck } from 'lucide-react';

function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            
            <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#07767c] to-[#055a5f] p-8 md:p-12 text-center text-white">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Política de Privacidad</h1>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                            En Busquidy, la confianza y la transparencia son nuestros pilares. 
                            Nos tomamos muy en serio la protección de tus datos personales y profesionales.
                        </p>
                        <p className="text-sm text-blue-200 mt-4">
                            Última actualización: Noviembre 2025
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 space-y-10 text-gray-600 leading-relaxed">
                        
                        {/* 1. Introducción */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                                1. Introducción
                            </h2>
                            <p>
                                La presente Política de Privacidad describe cómo <strong>Busquidy</strong> ("nosotros", "nuestro" o "la Plataforma") recopila, utiliza, almacena y protege la información personal de sus usuarios ("Usuarios"), tanto <strong>Freelancers</strong> (estudiantes y profesionales) como <strong>Empresas</strong> (Personas Naturales y Jurídicas).
                            </p>
                            <p className="mt-2">
                                Al utilizar nuestros servicios, aceptas las prácticas descritas en esta política, la cual se rige bajo la legislación chilena, específicamente la <strong>Ley N° 19.628 sobre Protección de la Vida Privada</strong>.
                            </p>
                        </section>

                        {/* 2. Información que Recopilamos */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                                <FileText className="text-[#07767c]" />
                                2. Información que Recopilamos
                            </h2>
                            <p className="mb-4">Para operar nuestro marketplace de servicios, recopilamos los siguientes tipos de datos:</p>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-2">Datos de Registro</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Nombre completo y RUT.</li>
                                        <li>Correo electrónico y número de teléfono.</li>
                                        <li>Contraseñas (encriptadas).</li>
                                    </ul>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-2">Datos de Verificación</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Fotografía del documento de identidad (DNI).</li>
                                        <li>Certificado de alumno regular o título.</li>
                                        <li>Escritura de constitución (Empresas Jurídicas).</li>
                                        <li>Inicio de actividades SII.</li>
                                    </ul>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-2">Perfil Profesional</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Historial académico y laboral.</li>
                                        <li>Habilidades técnicas y blandas.</li>
                                        <li>Portafolio y CV.</li>
                                        <li>Pretensiones de renta.</li>
                                    </ul>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-2">Datos Transaccionales</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Historial de proyectos y postulaciones.</li>
                                        <li>Pagos y facturación (procesados vía Webpay/Transbank).</li>
                                        <li>Mensajería interna y videollamadas.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 3. Uso de la Información */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                                <Eye className="text-[#07767c]" />
                                3. Uso de la Información
                            </h2>
                            <p>Utilizamos tus datos exclusivamente para los siguientes fines:</p>
                            <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                                <li><strong>Verificación de Identidad:</strong> Para garantizar la seguridad de la comunidad y prevenir fraudes, validamos manualmente los documentos subidos.</li>
                                <li><strong>Conexión Laboral:</strong> Utilizamos algoritmos para recomendar freelancers a empresas y viceversa, basándonos en habilidades y requisitos.</li>
                                <li><strong>Procesamiento de Pagos:</strong> Gestionamos los pagos en custodia (Escrow) y suscripciones para asegurar el cumplimiento de los servicios.</li>
                                <li><strong>Comunicaciones:</strong> Te enviamos notificaciones sobre el estado de tus proyectos, mensajes de chat y actualizaciones de la plataforma.</li>
                                <li><strong>Mejora del Servicio:</strong> Analizamos datos anonimizados para mejorar la experiencia de usuario y la estabilidad técnica (Cloud SQL, Node.js).</li>
                            </ul>
                        </section>

                        {/* 4. Protección y Seguridad */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                                <Lock className="text-[#07767c]" />
                                4. Protección y Seguridad de Datos
                            </h2>
                            <p>
                                Implementamos medidas de seguridad técnicas y organizativas robustas para proteger tu información contra el acceso no autorizado, la pérdida o la alteración.
                            </p>
                            <div className="mt-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <Server className="text-[#07767c] mt-1 flex-shrink-0" size={20} />
                                    <p>Nuestros servidores y bases de datos están protegidos con estándares de seguridad modernos.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <UserCheck className="text-[#07767c] mt-1 flex-shrink-0" size={20} />
                                    <p>El acceso a documentos de verificación está restringido exclusivamente al personal de administración autorizado de Busquidy.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Lock className="text-[#07767c] mt-1 flex-shrink-0" size={20} />
                                    <p>Las transacciones financieras se realizan a través de pasarelas seguras (Webpay) y no almacenamos datos completos de tarjetas de crédito en nuestros servidores.</p>
                                </div>
                            </div>
                        </section>

                        {/* 5. Compartir Información */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Compartir Información</h2>
                            <p>
                                <strong>No vendemos tu información personal a terceros.</strong> Solo compartimos información en los siguientes casos:
                            </p>
                            <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                                <li><strong>Entre Usuarios:</strong> Al contratar un servicio, la Empresa y el Freelancer pueden ver los datos de contacto necesarios para la ejecución del proyecto.</li>
                                <li><strong>Proveedores de Servicios:</strong> Con terceros que nos ayudan a operar la plataforma (ej. procesamiento de pagos, alojamiento en la nube), bajo estrictos acuerdos de confidencialidad.</li>
                                <li><strong>Requerimiento Legal:</strong> Si una autoridad competente lo solicita conforme a la ley chilena.</li>
                            </ul>
                        </section>

                        {/* 6. Tus Derechos */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Tus Derechos (ARCO)</h2>
                            <p>
                                Como titular de los datos, tienes derecho al Acceso, Rectificación, Cancelación y Oposición de tus datos personales. Puedes ejercer estos derechos o solicitar la eliminación de tu cuenta a través de nuestra sección de <strong>Soporte</strong> o escribiendo a contacto@busquidy.cl.
                            </p>
                        </section>

                        {/* Footer de la política */}
                        <div className="pt-8 border-t border-gray-200 text-center">
                            <p className="text-sm text-gray-500">
                                Si tienes dudas sobre nuestra Política de Privacidad, contáctanos a través de nuestro <a href="/soportehome" className="text-[#07767c] font-semibold hover:underline">Centro de Soporte</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default PrivacyPolicyPage;