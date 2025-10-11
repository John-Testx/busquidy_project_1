export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-2xl font-bold text-red-500">Acceso Denegado</h1>
        <p className="mt-2">No tienes permisos para ver esta página.</p>
      </div>
    </div>
  );
}