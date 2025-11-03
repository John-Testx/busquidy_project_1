import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { requestPasswordReset } from '@/api/userApi';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err.error || err.message || 'Error al enviar el correo de recuperación');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07767c] via-[#055a5f] to-[#043d42] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-[fadeIn_0.5s_ease-out]">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            ¡Correo Enviado!
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Si el correo <strong>{email}</strong> está registrado, recibirás un enlace de recuperación en unos momentos.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Revisa tu bandeja de spam si no ves el correo en los próximos minutos.
            </p>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#07767c] text-white py-3 rounded-lg font-semibold hover:bg-[#055a5f] transition-colors duration-200"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07767c] via-[#055a5f] to-[#043d42] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-[fadeIn_0.5s_ease-out]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#07767c]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#07767c]" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ¿Olvidaste tu Contraseña?
            </h1>
            
            <p className="text-gray-600">
              No te preocupes, te enviaremos instrucciones para recuperarla
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#07767c] focus:outline-none transition-colors duration-200"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-[fadeIn_0.3s_ease-out]">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#07767c] text-white py-3 rounded-lg font-semibold hover:bg-[#055a5f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                'Enviar Enlace de Recuperación'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Recordaste tu contraseña?{' '}
              <Link 
                to="/" 
                className="text-[#07767c] hover:text-[#055a5f] font-semibold transition-colors duration-200"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm">
            🔒 El enlace de recuperación expirará en 15 minutos por tu seguridad
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;