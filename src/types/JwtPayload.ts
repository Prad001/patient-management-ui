export interface JwtPayload {
    sub: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'RECEPTIONIST';
    iat: number;
    exp: number;
}