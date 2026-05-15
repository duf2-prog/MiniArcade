export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export interface UserProfile {
    id: string;
    nombre: string;
    email: string;
    avatar?: string;
    fechaRegistro: string;
    rol: Role;
    activo: boolean;
}

export interface Game {
    id: string;
    nombre: string;
    descripcion: string;
    fechaRegistro: string;
    activo: boolean;
}

export interface Score {
    id: string;
    usuarioId: string;
    juegoId: string;
    usuario: string;
    usuarioLowercase: string;
    puntuacion: number;
    fechaRegistro: string;
}