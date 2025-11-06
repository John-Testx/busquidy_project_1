import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingVerifications } from '@/api/adminApi';
import { Users, FileCheck, Clock, Search, Eye } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';

const VerificacionTable = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    try {
      const data = await getPendingVerifications();
      setUsers(data);
    } catch (error) {
      console.error('Error cargando verificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.tipo_usuario?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoUsuarioBadge = (tipo) => {
    const styles = {
      freelancer: 'bg-blue-100 text-blue-800',
      empresa_natural: 'bg-green-100 text-green-800',
      empresa_juridico: 'bg-purple-100 text-purple-800'
    };
    
    const labels = {
      freelancer: 'Freelancer',
      empresa_natural: 'Empresa Natural',
      empresa_juridico: 'Empresa Jurídica'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[tipo] || 'bg-gray-100 text-gray-800'}`}>
        {labels[tipo] || tipo}
      </span>
    );
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Pendientes</p>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
            <Clock className="opacity-80" size={40} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Freelancers</p>
              <p className="text-3xl font-bold">
                {users.filter(u => u.tipo_usuario === 'freelancer').length}
              </p>
            </div>
            <Users className="opacity-80" size={40} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Empresas</p>
              <p className="text-3xl font-bold">
                {users.filter(u => u.tipo_usuario.includes('empresa')).length}
              </p>
            </div>
            <Users className="opacity-80" size={40} />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por email o tipo de usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <FileCheck className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg font-medium">
              {searchTerm ? 'No se encontraron usuarios' : 'No hay verificaciones pendientes'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id_usuario} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-[#07767c] to-[#055a5f] w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.correo?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.correo}</p>
                          <p className="text-sm text-gray-500">ID: {user.id_usuario}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getTipoUsuarioBadge(user.tipo_usuario)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(user.fecha_creacion).toLocaleDateString('es-CL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => navigate(`/adminhome/verificaciones/detalle/${user.id_usuario}`)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#07767c] text-white rounded-lg hover:bg-[#055a5f] transition-colors font-medium"
                      >
                        <Eye size={16} />
                        Revisar Documentos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificacionTable;