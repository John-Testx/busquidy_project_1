import React from 'react';
import { Footer, Navbar } from '@/components/Home/';
import { FileSignature, AlertTriangle, Scale, CreditCard, Briefcase, CheckCircle } from 'lucide-react';

function TermsOfServicePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            
            <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-br from-[#2c3e50] to-[#34495e] p-8 md:p-12 text-center text-white">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-xl mb-6 backdrop-blur-sm">
                            <FileSignature size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Términos y Condiciones de Uso</h1>
                        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                            Bienvenido a Busquidy. Al utilizar nuestra plataforma, aceptas las reglas que rigen nuestra comunidad de trabajo colaborativo.
                        </p>
                        <p className="text-sm text-gray-400 mt-4">
                            Vigencia desde: Noviembre 2025
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 space-y-12 text-gray-600 leading-relaxed">
                        
                        {/* 1. Aceptación */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">1. Aceptación de los Términos</h2>
                            <p>
                                Al registrarse y utilizar la plataforma <strong>Busquidy</strong> ("la Plataforma"), usted acepta cumplir con estos Términos y Condiciones. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al servicio. Busquidy actúa como un intermediario tecnológico que conecta a estudiantes/freelancers con empresas y particulares.
                            </p>
                        </section>

                        {/* 2. Cuentas y Verificación */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                                <CheckCircle className="text-[#07767c]" size={24} />
                                2. Cuentas y Verificación de Usuarios
                            </h2>
                            <p className="mb-3">
                                Para garantizar la seguridad del ecosistema, Busquidy implementa un sistema de verificación estricto:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li><strong>Freelancers:</strong> Deben ser estudiantes de educación superior o recién egresados. Se requerirá la carga de documentos como Cédula de Identidad y Certificado de Alumno Regular o Título.</li>
                                <li><strong>Empresas:</strong> Deben acreditar su existencia legal (Persona Jurídica) o identidad (Persona Natural) mediante documentos como Escritura de Constitución, Inicio de Actividades SII y DNI del representante.</li>
                            </ul>
                            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800">
                                <strong>Nota:</strong> Busquidy se reserva el derecho de suspender o eliminar cuentas que proporcionen información falsa o documentos adulterados.
                            </div>
                        </section>

                        {/* 3. Funcionamiento del Marketplace */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                                <Briefcase className="text-[#07767c]" size={24} />
                                3. Publicación de Proyectos y Postulaciones
                            </h2>
                            <p>
                                Las Empresas pueden publicar <strong>Proyectos</strong> o <strong>Tareas</strong>. Los Freelancers pueden postular a estas ofertas.
                            </p>
                            <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
                                <li>La relación contractual final es entre la Empresa y el Freelancer. Busquidy facilita la conexión, las herramientas de gestión y el pago seguro.</li>
                                <li>Los Freelancers deben cumplir con los plazos y entregables acordados en la plataforma.</li>
                                <li>Las Empresas deben definir claramente los requisitos y el presupuesto del proyecto.</li>
                            </ul>
                        </section>

                        {/* 4. Pagos y Tarifas */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                                <CreditCard className="text-[#07767c]" size={24} />
                                4. Pagos, Custodia y Comisiones
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2">4.1. Sistema de Pago Seguro (Escrow)</h3>
                                    <p>
                                        Al contratar a un Freelancer, la Empresa debe abonar el 100% del valor acordado a Busquidy. Este dinero queda en <strong>custodia (garantía)</strong> y no se libera al Freelancer hasta que la Empresa confirme la recepción conforme del trabajo ("Liberar Pago").
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2">4.2. Comisiones</h3>
                                    <p>
                                        Busquidy cobra una comisión por servicio sobre el valor total del proyecto para mantener la plataforma operativa. Esta comisión se detalla antes de confirmar el pago.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2">4.3. Suscripciones (Busquidy+)</h3>
                                    <p>
                                        Ofrecemos planes de suscripción opcionales que otorgan beneficios como mayor visibilidad, menores comisiones o límites de postulación extendidos. Las suscripciones se renuevan automáticamente a menos que se cancelen antes del fin del periodo.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 5. Disputas y Reembolsos */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                                <Scale className="text-[#07767c]" size={24} />
                                5. Resolución de Disputas
                            </h2>
                            <p>
                                En caso de desacuerdo entre Empresa y Freelancer (trabajo no entregado, calidad deficiente, falta de pago):
                            </p>
                            <ol className="list-decimal list-inside mt-3 space-y-2 ml-2">
                                <li>Las partes deben intentar resolver el conflicto a través del chat interno.</li>
                                <li>Si no hay acuerdo, cualquiera de las partes puede iniciar una <strong>Disputa</strong>.</li>
                                <li>El equipo de administración de Busquidy actuará como árbitro, revisando las evidencias (chat, entregables).</li>
                                <li>La decisión de Busquidy sobre la liberación del pago al Freelancer o el reembolso a la Empresa es final.</li>
                            </ol>
                        </section>

                        {/* 6. Conducta */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                                <AlertTriangle className="text-[#07767c]" size={24} />
                                6. Conducta Prohibida
                            </h2>
                            <p>Queda estrictamente prohibido:</p>
                            <ul className="mt-3 grid md:grid-cols-2 gap-2">
                                <li className="bg-red-50 p-3 rounded-lg text-sm border border-red-100">🚫 Compartir datos de contacto externos antes de la contratación para evadir la plataforma.</li>
                                <li className="bg-red-50 p-3 rounded-lg text-sm border border-red-100">🚫 Publicar contenido ofensivo, discriminatorio o ilegal.</li>
                                <li className="bg-red-50 p-3 rounded-lg text-sm border border-red-100">🚫 Subcontratar el trabajo a terceros sin permiso.</li>
                                <li className="bg-red-50 p-3 rounded-lg text-sm border border-red-100">🚫 Crear múltiples cuentas para manipular el sistema de calificaciones.</li>
                            </ul>
                        </section>

                        {/* 7. Propiedad Intelectual */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">7. Propiedad Intelectual</h2>
                            <p>
                                Salvo acuerdo en contrario por escrito entre las partes, una vez que la Empresa libera el pago completo, la propiedad intelectual de los entregables creados por el Freelancer se transfiere a la Empresa. Busquidy conserva los derechos sobre la plataforma, su código, marca y diseño.
                            </p>
                        </section>

                        {/* 8. Limitación de Responsabilidad */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">8. Limitación de Responsabilidad</h2>
                            <p>
                                Busquidy no es responsable por la calidad, seguridad o legalidad de los servicios prestados por los Freelancers, ni por la capacidad de las Empresas para pagar. Actuamos únicamente como facilitadores. El uso de la plataforma es bajo su propio riesgo.
                            </p>
                        </section>

                        {/* Footer */}
                        <div className="bg-gray-100 p-6 rounded-xl text-center mt-12">
                            <p className="text-gray-700 mb-4">
                                ¿Tienes dudas sobre estos términos? Nuestro equipo legal y de soporte está disponible.
                            </p>
                            <a 
                                href="/soportehome" 
                                className="inline-block bg-[#07767c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#055a5f] transition-colors"
                            >
                                Contactar Soporte
                            </a>
                        </div>

                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default TermsOfServicePage;