// Variables de elementos y contexto
let video, canvas, ctx, audioElement, selfieSegmentation, stream;

// Configurar el tamaño del canvas
function setupCanvas() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
}

// Función para iniciar la cámara y el audio
window.startCamera = async function() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    audioElement = document.getElementById('backgroundAudio');

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        video.srcObject = stream;
        await video.play();
        setupCanvas();

        // Reproducir el audio cuando la cámara esté lista
        try {
            await audioElement.play();
        } catch (audioErr) {
            console.error('Error al reproducir el audio:', audioErr);
        }

        initializeSegmentation();
        processFrame();
    } catch (err) {
        console.error('Error al acceder a la cámara:', err);
    }
};

// Función para detener la cámara y el audio
window.stopCamera = function() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }
};

// Inicializar MediaPipe Selfie Segmentation
function initializeSegmentation() {
    selfieSegmentation = new SelfieSegmentation({ locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
    }});

    selfieSegmentation.setOptions({
        modelSelection: 1,
    });

    selfieSegmentation.onResults((results) => {
        ctx.save();

        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar solo la persona (máscara de segmentación)
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        // Usar la máscara de segmentación para recortar el fondo
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);

        ctx.restore();
    });
}

// Procesar cada frame
async function processFrame() {
    if (video.videoWidth > 0) {
        await selfieSegmentation.send({ image: video });
    }
    requestAnimationFrame(processFrame);
}
