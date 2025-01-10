import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ar-viewer',
  templateUrl: './ar-viewer.component.html',
  
  standalone: true
})
export class ArViewerComponent implements OnInit, OnDestroy {
  video!: HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D | null;
  audioElement!: HTMLAudioElement;
  selfieSegmentation: any;
  isProcessing = false;
  frameRate = 100;

  constructor(private location: Location) {}

  ngOnInit(): void {
    this.video = document.getElementById('video') as HTMLVideoElement;
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.audioElement = document.getElementById('backgroundAudio') as HTMLAudioElement;

    this.startCamera();
    this.initMediaPipe();
    this.processFrame();
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      this.video.srcObject = stream;
      await this.video.play();
      this.setupCanvas();

      try {
        await this.audioElement.play();
      } catch (audioErr) {
        console.error('Error al reproducir el audio:', audioErr);
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
    }
  }

  setupCanvas() {
    if (this.video && this.canvas) {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
    }
  }

  initMediaPipe() {
    this.selfieSegmentation = new (window as any).SelfieSegmentation({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
    });

    this.selfieSegmentation.setOptions({ modelSelection: 1 });

    this.selfieSegmentation.onResults((results: any) => {
      if (this.ctx && !this.isProcessing) {
        this.isProcessing = true;
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.drawImage(results.image, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'destination-in';
        this.ctx.drawImage(results.segmentationMask, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        this.isProcessing = false;
      }
    });
  }

  async processFrame() {
    if (this.video.videoWidth > 0 && !this.isProcessing) {
      try {
        await this.selfieSegmentation.send({ image: this.video });
      } catch (error) {
        console.error("Error al procesar el frame:", error);
      }
    }
    setTimeout(() => {
      requestAnimationFrame(this.processFrame.bind(this));
    }, this.frameRate);
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.video.srcObject) {
      const tracks = (this.video.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
  }
}
