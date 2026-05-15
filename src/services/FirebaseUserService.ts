import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import type { IUserService } from "../interfaces/IUserService";
import type { UserProfile } from "../entities/Entities";
import Logging from "../services/Logging";
import { Role } from "../entities/Entities";

export class FirebaseUserService implements IUserService {

    async getAllUsers(): Promise<{ [uid: string]: UserProfile }> {
        const db = getDatabase();
        Logging.debug("Obteniendo todos los usuarios");

        const snapshot = await get(ref(db, "users"));

        if (!snapshot.exists()) {
            Logging.warn("No existen usuarios en la base de datos");
            return {};
        }

        Logging.info("Usuarios obtenidos correctamente");
        return snapshot.val() as { [uid: string]: UserProfile };
    }

    async getUserById(uid: string): Promise<UserProfile> {
        const db = getDatabase();
        Logging.debug(`Obteniendo usuario con ID ${uid}`);

        const snapshot = await get(ref(db, `users/${uid}`));

        if (!snapshot.exists()) {
            Logging.warn(`Usuario con ID ${uid} no encontrado`);
            throw new Error(`Usuario con ID ${uid} no encontrado`);
        }

        Logging.info(`Usuario ${uid} obtenido correctamente`);
        return snapshot.val() as UserProfile;
    }

    async createUser(profile: UserProfile): Promise<void> {
        const db = getDatabase();
        Logging.info(`Creando usuario con ID ${profile.id}`);

        await set(ref(db, `users/${profile.id}`), profile);

        Logging.debug(`Usuario ${profile.id} creado en la base de datos`);
    }

    async updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
        const db = getDatabase();
        Logging.info(`Actualizando perfil del usuario ${uid}`);

        await update(ref(db, `users/${uid}`), profile);

        Logging.debug(`Perfil del usuario ${uid} actualizado`);
    }

    async setUserRole(uid: string, rol: Role): Promise<void> {
        const db = getDatabase();
        Logging.info(`Asignando rol ${rol} al usuario ${uid}`);

        await update(ref(db, `users/${uid}`), { rol });

        Logging.debug(`Rol actualizado para el usuario ${uid}`);
    }

    async deleteUser(uid: string): Promise<void> {
        const db = getDatabase();
        Logging.warn(`Eliminando usuario ${uid}`);

        await remove(ref(db, `users/${uid}`));

        Logging.info(`Usuario ${uid} eliminado`);
    }
}
