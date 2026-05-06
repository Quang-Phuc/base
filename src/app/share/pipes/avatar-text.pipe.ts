import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'avatarText',
    standalone: true,
})
export class AvatarTextPipe implements PipeTransform {
    transform(value: string): string {
        // Trim any extra spaces from the beginning and end of the string
        if (!value) return 'AD';
        const trimmedName = value.trim();

        // Split the name by spaces to get each word
        const words = trimmedName.split(' ');

        // Get the first letter of the first and last word
        const firstInitial = words[0].charAt(0).toUpperCase();
        const lastInitial = words[words.length - 1].charAt(0).toUpperCase();

        // Concatenate and return the initials
        return firstInitial + lastInitial;
    }
}
