import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TokenStorage } from './token-storage';
import { CookieStorage } from '../cookie/cookie-storage';

export interface CurrentUser {
  id: number;
  username: string;
  fullName: string;
  roles: string[];
  email?: string;
  phone?: string;
  avatarUrl?: string;
  introduction?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn = signal(false);
  currentUser = signal<CurrentUser | null>(null);

  private readonly isBrowser: boolean;
  private readonly USER_KEY = 'currentUser';

  constructor(
      private tokens: TokenStorage,
      private router: Router,
      private cookie: CookieStorage,
      @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.checkInitialLoginStatus();
  }

  private readUserFromClient(): CurrentUser | null {
    if (!this.isBrowser) return null;
    const raw = this.cookie.get(this.USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as CurrentUser;
    } catch (e) {
      console.error('❌ [AUTH] Parse user cookie failed:', e);
      return null;
    }
  }

  private writeUserToClient(user: CurrentUser | null, remember: boolean = false): void {
    if (!this.isBrowser) return;
    if (!user) {
      this.cookie.remove(this.USER_KEY);
      return;
    }
    const days = remember ? 7 : 1;
    this.cookie.set(this.USER_KEY, JSON.stringify(user), days);
  }

  private checkInitialLoginStatus(): void {
    const token = this.tokens.getAccessToken();
    const refreshToken = this.tokens.getRefreshToken();

    console.log(`%c🔍 [AUTH] AccessToken: ${!!token} | RefreshToken: ${!!refreshToken}`, 'color: #8b5cf6');

    // ✅ NẾU CÒN REFRESH TOKEN THÌ VẪN CHO LÀ LOGGED IN
    // Để Interceptor có cơ hội thực hiện cú "vả" 401 và lấy token mới
    if (token || refreshToken) {
      this.isLoggedIn.set(true);
      const user = this.readUserFromClient();
      if (user) {
        console.log('🔍 [AUTH] User restored from cookie:', user.username);
        this.currentUser.set(user);
      }
    } else {
      this.isLoggedIn.set(false);
      console.warn('⚠️ [AUTH] No tokens found, user is guest.');
    }
  }

  loginSuccess(accessToken: string, refreshToken?: string, user?: CurrentUser, remember: boolean = false): void {
    console.log('%c🚀 [AUTH] Login Success triggered!', 'color: #10b981; font-weight: bold');

    this.tokens.saveAccessToken(accessToken, remember);
    if (refreshToken) {
      this.tokens.saveRefreshToken(refreshToken, remember);
    }

    // ✅ Bắn tín hiệu cho toàn hệ thống
    this.isLoggedIn.set(true);

    if (user) {
      this.currentUser.set(user);
      this.writeUserToClient(user, remember);
    }
  }

  updateCurrentUser(patch: Partial<CurrentUser>): void {
    const curr = this.currentUser();
    if (!curr) return;
    const next: CurrentUser = { ...curr, ...patch };
    this.currentUser.set(next);
    this.writeUserToClient(next, true);
  }

  logout(): void {
    this.tokens.clear();
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.writeUserToClient(null);

    if (this.isBrowser) {
      // Dọn sạch cookie/localStorage liên quan đến quyền và menu
      const keysToRemove = ['navGroups', 'permissions', 'stores', 'selectedStoreId', 'uiTheme'];
      keysToRemove.forEach(key => {
        this.cookie.remove(key); // Xóa trong Cookie vì bồ lưu SSR
        localStorage.removeItem(key); // Xóa thêm cả local cho chắc
      });
    }
    this.router.navigate(['/login']);
  }
}