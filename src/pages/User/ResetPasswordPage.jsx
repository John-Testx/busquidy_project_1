import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '@/api/userApi';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token de recuperación inválido');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.error || err.message || 'Error al resetear la contraseña');
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
            ¡Contraseña Actualizada!
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#07767c] text-white py-3 rounded-lg font-semibold hover:bg-[#055a5f] transition-colors duration-200"
          >
            Ir al Inicio de Sesión
          </button>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07767c] via-[#055a5f] to-[#043d42] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Enlace Inválido
          </h2>
          
          <p className="text-gray-600 mb-6">
            Este enlace de recuperación no es válido o ha expirado.
          </p>
          
          <Link
            to="/forgot-password"
            className="inline-block w-full bg-[#07767c] text-white py-3 rounded-lg font-semibold hover:bg-[#055a5f] transition-colors duration-200"
          >
            Solicitar Nuevo Enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07767c] via-[#055a5f] to-[#043d42] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-[fadeIn_0.5s_ease-out]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#07767c]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#07767c]" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Nueva Contraseña
            </h1>
            
            <p className="text-gray-600">
              Ingresa tu nueva contraseña para tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#07767c] focus:outline-none transition-colors duration-200"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#07767c] focus:outline-none transition-colors duration-200"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Requisitos de la contraseña:
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li className={password.length >= 6 ? 'text-green-600' : ''}>
                  ✓ Mínimo 6 caracteres
                </li>
                <li className={password === confirmPassword && password ? 'text-green-600' : ''}>
                  ✓ Las contraseñas coinciden
                </li>
              </ul>
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
                  Actualizando...
                </span>
              ) : (
                'Restablecer Contraseña'
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm">
            🔒 Tu nueva contraseña será encriptada de forma segura
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;