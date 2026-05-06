import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CookieStorage {
    private readonly isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: object) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    get(name: string): string | null {
        if (!this.isBrowser) return null;

        const key = encodeURIComponent(name) + '=';
        const cookies = document.cookie.split('; ');

        for (const c of cookies) {
            if (c.startsWith(key)) {
                return decodeURIComponent(c.substring(key.length));
            }
        }
        return null;
    }

    // Thêm path vào tham số thứ 4 để hết lỗi TS2554
    set(name: string, value: string, days = 7, path = '/'): void {
        if (!this.isBrowser) return;

        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie =
            `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ` +
            `expires=${expires}; path=${path}; SameSite=Lax`;

        console.log(`🍪 [CookieStorage] Saved: ${name} at path: ${path}`);
    }

    remove(name: string, path = '/'): void {
        if (!this.isBrowser) return;

        document.cookie =
            `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; SameSite=Lax`;
    }
}