import { Component, ElementRef, inject, Input, Renderer2, signal } from '@angular/core';
import { AsyncPipe, NgStyle } from '@angular/common';
import { map, Observable, tap } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpBackend, HttpClient } from '@angular/common/http';

@Component({
    selector: 'ase-icon',
    standalone: true,
    imports: [AsyncPipe, NgStyle],
    templateUrl: './ase-icon.html',
    styles: `
        :host {
            display: inline-block;
        }
    `,
})
export class AseIcon {
    private sanitizer = inject(DomSanitizer);
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);
    // Bỏ qua interceptor bằng cách dùng HttpBackend
    private httpBackend = inject(HttpBackend);
    private rawHttpClient = new HttpClient(this.httpBackend); // không qua interceptor

    @Input({ required: true })
    set iconName(name: string) {
        if (!name) return;
        this.svgIcon$ = this.rawHttpClient.get(`../assets/icons/${name}.svg`, { responseType: 'text' }).pipe(
            tap((svgContent) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(svgContent as string, 'image/svg+xml');
                const svgElement = doc.documentElement;
                const heightAttr = svgElement.getAttribute('height');
                this.heightSvg.set(Number(heightAttr));
                this.setHeight(this.heightSvg());
            }),
            map((value) => this.sanitizer.bypassSecurityTrustHtml(value)),
        );
    }

    private setHeight(height: number) {
        this.renderer.setStyle(this.el.nativeElement, 'height', `${height}px`);
    }

    svgIcon$!: Observable<SafeHtml>;
    heightSvg = signal(16);
}
