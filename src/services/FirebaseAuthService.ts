import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "./FirebaseConfig";
import Logging from "../services/Logging";
import { type IAuthService } from "../interfaces/IAuthServices";

const auth = getAuth(app);

export class FirebaseAuthService implements IAuthService {

    signIn(email: string, password: string): Promise<any> {
        Logging.info(`Intento de login con email ${email}`);
        return signInWithEmailAndPassword(auth, email, password);
    }

    signUp(email: string, password: string): Promise<any> {
        Logging.info(`Intento de registro con email ${email}`);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    signOut(): Promise<void> {
        Logging.info("Cierre de sesión solicitado");
        return signOut(auth);
    }

    onAuthStateChanged(callback: (user: any) => void): () => void {
        Logging.debug("Suscripción a onAuthStateChanged");
        return onAuthStateChanged(auth, callback);
    }

    getCurrentUser(): any | null {
        return auth.currentUser;
    }
}
