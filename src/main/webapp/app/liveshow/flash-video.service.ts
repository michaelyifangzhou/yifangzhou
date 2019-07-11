import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FlashVideoService {
    private renderer: Renderer2;
    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    showVideo(bottom, left, width, src, parentElement) {
        return new Promise(res => {
            const video = this.getNewVideoRef(parentElement);
            video.style.bottom = bottom + 'px';
            video.style.left = left + 'px';
            video.style.width = width + 'px';
            video.src = src;
            video.onended = () => {
                this.renderer.removeChild(parentElement, video);
                res();
            };
            video.play();
        });
    }

    private getNewVideoRef(parentElement): HTMLVideoElement {
        const video: HTMLVideoElement = document.createElement('video');
        video.style.position = 'absolute';
        video.style.zIndex = '999';
        this.renderer.appendChild(parentElement, video);
        return video;
    }
}
