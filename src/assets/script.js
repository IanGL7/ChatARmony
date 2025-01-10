document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    let isUsingFrontCamera = true;

    async function startCamera() {
        try {
            // Detener cualquier stream existente
            if (video.srcObject) {
                const tracks = video.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: isUsingFrontCamera ? 'user' : 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            video.srcObject = stream;
            
            // Asegurarse de que el video se reproduzca
            try {
                await video.play();
            } catch (err) {
                console.error('Error al reproducir el video:', err);
            }
        } catch (err) {
            console.error('Error al acceder a la cámara:', err);
        }
    }

    // Iniciar la cámara automáticamente
    startCamera();

    // Función para cambiar entre cámaras
    window.toggleCamera = function() {
        isUsingFrontCamera = !isUsingFrontCamera;
        startCamera();
    }

    // Cleanup cuando se cierra la página
    window.addEventListener('beforeunload', () => {
        if (video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    });
});