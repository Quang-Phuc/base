import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'messageError',
})
export class MessageErrorPipe implements PipeTransform {
    transform(errorCode: unknown, label: string): string {
        return this.getErrorMessage(errorCode as string, label);
    }

    getErrorMessage(errorCode: string, label: string): string {
        switch (errorCode) {
            case 'required':
                return `Vui lòng nhập thông tin.`;

            case 'email':
                return `${label} không đúng định dạng email.`;

            case 'pattern':
                return `${label} không hợp lệ.`;
            case 'passwordStrength':
                return `Mật khẩu phải có ít nhát 8 ký tự, gồm chữ hoa, chữ thường, số,ký tự đặc biệt.`;
            case 'notMatchError':
                return `${label} không khớp`;
            case 'phoneInvalid':
                return 'Số điện thoại không đúng định dạng';
            case 'emailInvalid':
                return `Email không đúng định dạng.`;
            case 'phoneAllInvalid':
                return `Số điện thoại không đúng định dạng`;
            default:
                return `${label} có giá trị không hợp lệ.`;
        }
    }
}
