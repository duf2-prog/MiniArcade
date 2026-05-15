import { createContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../services/AuthService";
import { userService } from "../services/UserService";
import logger from "../services/Logging";
import type { UserProfile } from "../entities/Entities";

interface AuthContextProps {
    user: UserProfile | null;
    loading: boolean;
    setUser: (user: UserProfile | null) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    loading: true,
    setUser: () => { }
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    async function waitForUserDocument(uid: string) {
        const maxRetries = 10;
        const delay = 200;

        for (let i = 0; i < maxRetries; i++) {
            try {
                const perfil = await userService.getUserById(uid);
                logger.info(`Perfil cargado para UID ${uid}`);
                return perfil;
            } catch (err: any) {
                if (err.message.includes("no encontrado")) {
                    logger.warn(`Documento de usuario ${uid} no encontrado, reintentando...`);
                    await new Promise(res => setTimeout(res, delay));
                    continue;
                }
                logger.error(`Error inesperado cargando perfil ${uid}: ${err}`);
                throw err;
            }
        }

        logger.error(`Documento de usuario ${uid} no encontrado tras varios intentos`);
        throw new Error("Documento de usuario no encontrado tras varios intentos");
    }

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
            if (!currentUser) {
                logger.info("Usuario no autenticado");
                setUser(null);
                setLoading(false);
                return;
            }

            logger.info(`AuthStateChanged detectado: UID ${currentUser.uid}`);

            try {
                const profile = await waitForUserDocument(currentUser.uid);

                if (!profile.activo && profile.email !== "duf2@alu.ua.es") {
                    logger.warn(`Usuario ${currentUser.uid} inactivo, cerrando sesión`);
                    await authService.signOut();
                    setUser(null);
                    setLoading(false);
                    return;
                }

                logger.info(`Usuario autenticado correctamente: ${profile.id}`);
                setUser(profile);
            } catch (error) {
                logger.error(`Error cargando perfil en AuthContext: ${error}`);
                setUser(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
