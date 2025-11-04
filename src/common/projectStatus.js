export const projectStatus = (status) => {
        switch(status) {
            case 'activo':
                return {
                    bg: 'bg-gradient-to-r from-emerald-100 to-emerald-50',
                    text: 'text-emerald-700',
                    border: 'border-emerald-300',
                    label: 'Publicado'
                };
            case 'pendiente':
                return {
                    bg: 'bg-gradient-to-r from-amber-100 to-amber-50',
                    text: 'text-amber-700',
                    border: 'border-amber-300',
                    label: 'Pendiente'
                };
            case 'finalizado':
                return {
                    bg: 'bg-gradient-to-r from-blue-100 to-blue-50',
                    text: 'text-blue-700',
                    border: 'border-blue-300',
                    label: 'Finalizado'
                };
            case 'sin publicar':
                return {
                    bg: 'bg-gradient-to-r from-gray-100 to-gray-50',
                    text: 'text-gray-700',
                    border: 'border-gray-300',
                    label: 'No Publicado'
                };
            default:
                return {
                    bg: 'bg-gradient-to-r from-gray-100 to-gray-50',
                    text: 'text-gray-700',
                    border: 'border-gray-300',
                    label: status || 'Desconocido'
                };
        }
};

