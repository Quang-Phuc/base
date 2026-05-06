import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { BaseControlAccessor } from '@core/base-control-accessor';
import { FileSelectEvent, FileUpload, FileUploadEvent } from 'primeng/fileupload';
import { Button } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { FormsModule } from '@angular/forms';
import { InputError } from '@share/input-error/input-error';
import {ModeEventsEnum} from "@core/enums/control-access.enum";

@Component({
    selector: 'ase-upload',
    imports: [FileUpload, Button, FormsModule, InputError],
    templateUrl: './upload.html',
    styles: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Upload extends BaseControlAccessor<File | File[] | null | string> {
    readonly config = inject(PrimeNG);

    onUpload($event: FileUploadEvent) {}

    onSelectFile($event: FileSelectEvent) {}

    choose(event: Event, callback: () => void) {
        callback();
    }

    uploadEvent(callback: () => void) {
        callback();
    }

    onTemplatedUpload() {}

    onSelectedFiles($event: FileSelectEvent) {
        const targetFile: FileList = ($event.originalEvent.target as HTMLInputElement).files as FileList;
        const files: File[] = $event.currentFiles;
        const isMaxSize = Array.from(targetFile).some((file) => file.size > this.maxSizePerFile());
        for (const file of files) {
            if (file.size > this.maxSizePerFile()) {
                break;
            }
            this.totalSizeInner.update((val: number) => val + parseInt(this.formatSize(file.size)));
            if (this.totalSizeInner() > this.totalSize()) {
                break;
            }
            this.fileSelected.update((val) => [...new Set([...val, file])]);
        }
        this.updateValue(this.fileSelected());
    }

    onRemoveTemplatingFile(
        $event: PointerEvent,
        file: File,
        removeFileCallback: (event: Event, index: number) => void,
        index: number,
    ) {
        removeFileCallback($event, index);
        this.totalSizeInner.update((val) => val - parseInt(this.formatSize(file.size)));
        this.fileSelected.update((val) => val.filter((_, i) => i !== index));
        this.updateValue(this.fileSelected());
    }

    formatSize(bytes: number) {
        const k = 1024;
        const dm = 3;
        const sizes = this.config.translation.fileSizeTypes;
        if (bytes === 0) {
            return `0 ${sizes?.[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes?.[i]}`;
    }

    override onValueChange(_value: File | File[] | string | null) {
        if (Array.isArray(_value)) {
            this.fileSelected.set(_value);
        }
        if (_value instanceof File && !Array.isArray(_value)) {
            this.fileSelected.set([_value]);
        }
        this.updateValue(this.fileSelected());
        this.cdr.detectChanges();
    }

    actionEvents = input<ModeEventsEnum>(this.ModeEventsEnum.NEW);
    uploadMode = input<'img' | 'file' | 'all'>('img');
    maxSizePerFile = input(1000000);
    multipleUpload = input(true);
    fileSelected = signal<File[]>([]);
    totalSize = input(2000000);
    totalSizeInner = signal<number>(0);

    onClearAll() {
        this.fileSelected.set([]);
        this.updateValue([]);
    }

    onBlur() {
        this.markAsTouched();
    }
}
