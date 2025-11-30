import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock, Loader2 } from 'lucide-react';
import { getProjectDeliverables } from '@/api/deliverablesApi';

const DeliverablesList = ({ idProject, refreshTrigger }) => {
    const [deliverables, setDeliverables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (idProject) {
            loadDeliverables();
        }
    }, [idProject, refreshTrigger]); // Se recarga si cambia refreshTrigger

    const loadDeliverables = async () => {
        try {
            setLoading(true);
            const data = await getProjectDeliverables(idProject);
            setDeliverables(data);
        } catch (error) {
            console.error("Error cargando entregables:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin text-gray-400" /></div>;

    if (deliverables.length === 0) {
        return (
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No hay entregables subidos aún.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {deliverables.map((item) => (
                <div key={item.id_entregable} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="mt-1 p-2 bg-blue-50 rounded text-blue-600">
                        <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {item.nombre_archivo || 'Archivo adjunto'}
                        </p>
                        {item.descripcion && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.descripcion}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock size={10} /> 
                            {new Date(item.fecha_entrega).toLocaleDateString()} {new Date(item.fecha_entrega).toLocaleTimeString()}
                        </p>
                    </div>
                    {item.archivo_url && (
                        <a 
                            href={item.archivo_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-[#07767c] hover:bg-gray-50 rounded-full transition-colors"
                            title="Descargar/Ver"
                        >
                            <Download size={18} />
                        </a>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DeliverablesList;