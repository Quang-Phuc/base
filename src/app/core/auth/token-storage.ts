import { Injectable } from '@angular/core';
import { CookieStorage } from "../cookie/cookie-storage";

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private readonly ACCESS_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';

  constructor(private cookie: CookieStorage) {}

  saveAccessToken(token: string, remember: boolean = false): void {
    const days = remember ? 7 : 1;
    // Bây giờ truyền 4 tham số thoải mái, không sợ lỗi TS2554
    this.cookie.set(this.ACCESS_KEY, token, days, '/');
  }

  saveRefreshToken(token: string, remember: boolean = false): void {
    const days = remember ? 30 : 1;
    this.cookie.set(this.REFRESH_KEY, token, days, '/');
  }

  // Các hàm get và clear giữ nguyên...
  getAccessToken(): string | null {
    return this.cookie.get(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return this.cookie.get(this.REFRESH_KEY);
  }

  clear(): void {
    this.cookie.remove(this.ACCESS_KEY);
    this.cookie.remove(this.REFRESH_KEY);
  }
}