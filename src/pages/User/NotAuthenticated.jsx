import {useNavigate} from "react-router-dom"



export default function NotAuthenticated() {
  
  const navigate = useNavigate();
  
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Debes iniciar sesión</h1>
          <button onClick={() => navigate("/")} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
}