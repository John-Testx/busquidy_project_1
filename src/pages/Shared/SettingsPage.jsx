import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updateCredentials } from '@/api/userApi';
import { useAuth } from '@/hooks';
import { Mail, Lock, Shield, Eye, EyeOff, CheckCircle, AlertTriangle, Key } from 'lucide-react';

function SettingsPage() {
  const { id_usuario } = useAuth();
  
  // Estado para cambio de email
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    currentPasswordForEmail: '',
  });
  const [loadingEmail, setLoadingEmail] = useState(false);

  // Estado para cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Manejador para cambio de email
  const handleEmailChange = async (e) => {
    e.preventDefault();
    
    if (!emailForm.newEmail || !emailForm.currentPasswordForEmail) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.newEmail)) {
      toast.error('El formato del email no es válido');
      return;
    }

    setLoadingEmail(true);
    try {
      await updateCredentials({
        currentPassword: emailForm.currentPasswordForEmail,
        newEmail: emailForm.newEmail,
      });
      
      toast.success('Email actualizado exitosamente');
      setEmailForm({ newEmail: '', currentPasswordForEmail: '' });
    } catch (error) {
      const errorMsg = error.error || error.message || 'Error al actualizar el email';
      toast.error(errorMsg);
    } finally {
      setLoadingEmail(false);
    }
  };

  // Manejador para cambio de contraseña
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoadingPassword(true);
    try {
      await updateCredentials({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      toast.success('Contraseña actualizada exitosamente');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const errorMsg = error.error || error.message || 'Error al actualizar la contraseña';
      toast.error(errorMsg);
    } finally {
      setLoadingPassword(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { label: 'Muy débil', color: 'bg-red-500' },
      { label: 'Débil', color: 'bg-orange-500' },
      { label: 'Aceptable', color: 'bg-yellow-500' },
      { label: 'Buena', color: 'bg-blue-500' },
      { label: 'Excelente', color: 'bg-green-500' },
    ];

    return { strength, ...levels[Math.min(strength, 4)] };
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#05595d] rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuración de Seguridad</h1>
              <p className="text-gray-600">Gestiona tus credenciales de acceso</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card: Cambiar Email */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-fit">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Mail className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Cambiar Email</h2>
                  <p className="text-white/80 text-xs">Actualiza tu correo electrónico</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleEmailChange} className="p-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <Mail className="text-[#07767c]" size={16} />
                  Nuevo Email
                </label>
                <input
                  type="email"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#07767c] focus:outline-none transition-colors hover:border-gray-300"
                  placeholder="nuevo@email.com"
                  disabled={loadingEmail}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <Key className="text-[#07767c]" size={16} />
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={emailForm.currentPasswordForEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, currentPasswordForEmail: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#07767c] focus:outline-none transition-colors hover:border-gray-300"
                  placeholder="••••••••"
                  disabled={loadingEmail}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Confirma tu contraseña para realizar el cambio
                </p>
              </div>

              <button
                type="submit"
                disabled={loadingEmail}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loadingEmail ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Actualizar Email
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card: Cambiar Contraseña */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-fit">
            <div className="bg-gradient-to-r from-[#07767c] to-[#05595d] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Lock className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Cambiar Contraseña</h2>
                  <p className="text-white/80 text-xs">Actualiza tu contraseña de acceso</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <Key className="text-[#07767c]" size={16} />
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#07767c] focus:outline-none transition-colors hover:border-gray-300"
                    placeholder="••••••••"
                    disabled={loadingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <Lock className="text-[#07767c]" size={16} />
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#07767c] focus:outline-none transition-colors hover:border-gray-300"
                    placeholder="••••••••"
                    disabled={loadingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {passwordForm.newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">Fortaleza:</span>
                      <span className={`text-xs font-bold ${
                        passwordStrength.strength <= 1 ? 'text-red-600' :
                        passwordStrength.strength === 2 ? 'text-yellow-600' :
                        passwordStrength.strength === 3 ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <CheckCircle className="text-[#07767c]" size={16} />
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#07767c] focus:outline-none transition-colors hover:border-gray-300"
                    placeholder="••••••••"
                    disabled={loadingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    Las contraseñas no coinciden
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loadingPassword}
                className="w-full bg-gradient-to-r from-[#07767c] to-[#05595d] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loadingPassword ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Actualizar Contraseña
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Consejos de Seguridad</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-[#07767c] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="text-white" size={14} />
                  </div>
                  <p className="text-sm text-gray-700">Usa una contraseña única y segura combinando letras, números y símbolos</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-[#07767c] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="text-white" size={14} />
                  </div>
                  <p className="text-sm text-gray-700">No compartas tus credenciales con terceros</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-[#07767c] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="text-white" size={14} />
                  </div>
                  <p className="text-sm text-gray-700">Cierra sesión en dispositivos compartidos</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-[#07767c] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="text-white" size={14} />
                  </div>
                  <p className="text-sm text-gray-700">Mantén tu información actualizada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;