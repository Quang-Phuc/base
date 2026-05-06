import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    input,
    signal,
    viewChild,
} from '@angular/core';
import Prism from 'prismjs';
import {Tooltip} from "primeng/tooltip";
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
@Component({
    selector: 'ase-doc-block',
    imports: [Tooltip],
    templateUrl: './doc-block.html',
    styles: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocBlock implements AfterViewInit {
    code = input.required<string>();
    title = input('');
    language = input<'markup' | 'typescript' | 'css'>('markup');
    codeElement = viewChild<ElementRef>('codeElement');
    highlightedCode = signal<string>('');

    constructor() {
        effect(() => {
            const cde = this.code();
            const lang = this.language();
            // Khi code hoặc language thay đổi, gọi hàm highlight lại
            if (cde || lang) {
                this.highlight();
            }
        });
    }

    ngAfterViewInit() {
        this.highlight();
    }

    copyCode() {
        navigator.clipboard.writeText(this.code());
    }

    highlight(): void {
        const rawCode = this.code();
        const lang = this.language();

        // Lấy grammar (ngữ pháp) của ngôn ngữ từ Prism
        const grammar = Prism.languages[lang];

        if (!grammar) {
            console.warn(`[CodeBlock] PrismJS grammar for language "${lang}" not found. Did you import it?`);
            // Nếu không có grammar, hiển thị code gốc (đã escape)
            this.highlightedCode.set(this.escapeHtml(rawCode));
            return;
        }

        // Prism.highlight sẽ trả về một chuỗi HTML đã được tô màu
        const highlighted = Prism.highlight(rawCode, grammar, lang);
        this.highlightedCode.set(highlighted);
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}
