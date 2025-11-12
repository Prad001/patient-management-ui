import { Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub: string;
    id: string;
    role: string;
    iat: number;
    exp: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'token';
    token = signal<string | null>(this.getTokenFromStorage());

    private getTokenFromStorage(): string | null {
        return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    }

    getToken(): string | null {
        return this.token();
    }

    getDecodedToken(): JwtPayload | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            return jwtDecode<JwtPayload>(token);
        } catch (e) {
            console.error('Invalid JWT token', e);
            return null;
        }
    }

    getUserId(): string | null {
        return this.getDecodedToken()?.id || null;
    }

    getUserEmail(): string | null {
        return this.getDecodedToken()?.sub || null;
    }

    getUserRole(): string | null {
        return this.getDecodedToken()?.role || null;
    }
}
