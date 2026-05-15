import { useState, useEffect, type JSX } from "react";
import Modal from "./Modal";
import { authService } from "../services/AuthService";
import { userService } from "../services/UserService";
import Logging from "../services/Logging";
import { FormattedMessage } from "react-intl";
import { Role } from "../entities/Entities";
import { useIntl } from "react-intl";

export default function RegisterLoginModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [emailReg, setEmailReg] = useState("");
    const [passReg, setPassReg] = useState("");
    const [username, setUsername] = useState("");

    const [emailLog, setEmailLog] = useState("");
    const [passLog, setPassLog] = useState("");

    const [error, setError] = useState<JSX.Element | string>("");

    const intl = useIntl();

    useEffect(() => {
        if (isOpen) {
            setEmailReg("");
            setPassReg("");
            setUsername("");
            setEmailLog("");
            setPassLog("");
            setError("");
        }
    }, [isOpen]);

    const handleRegister = async () => {
        try {
            setError("");
            Logging.info(`Intento de registro con email ${emailReg}`);

            const userCredential = await authService.signUp(emailReg, passReg);
            const uid = userCredential.user.uid;

            await userService.createUser({
                id: uid,
                nombre: username,
                email: emailReg,
                avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${uid}`,
                fechaRegistro: new Date().toISOString(),
                rol: emailReg === "duf2@alu.ua.es" ? Role.ADMIN : Role.USER,
                activo: true,
            });

            await userCredential.user.reload();

            Logging.info(`Registro completado para UID ${uid}`);
            onClose();
        } catch (err: any) {
            Logging.error(`Error en registro: ${err.code}`);
            setError(translateFirebaseError(err.code));
        }
    };

    const handleLogin = async () => {
        try {
            setError("");
            Logging.info(`Intento de login con email ${emailLog}`);

            await authService.signIn(emailLog, passLog);

            Logging.info(`Login correcto para ${emailLog}`);
            onClose();
        } catch (err: any) {
            Logging.error(`Error en login: ${err.code}`);
            setError(translateFirebaseError(err.code));
        }
    };

    function translateFirebaseError(code: string): JSX.Element {
        switch (code) {
            case "auth/email-already-in-use":
                return <FormattedMessage id="error.emailAlreadyInUse" />;
            case "auth/invalid-email":
                return <FormattedMessage id="error.invalidEmail" />;
            case "auth/weak-password":
                return <FormattedMessage id="error.weakPassword" />;
            case "auth/user-not-found":
                return <FormattedMessage id="error.userNotFound" />;
            case "auth/wrong-password":
                return <FormattedMessage id="error.wrongPassword" />;
            case "auth/too-many-requests":
                return <FormattedMessage id="error.tooManyRequests" />;
            default:
                return <FormattedMessage id="error.unknownError" />;
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="form-grid-2">

                <div className="form-section">
                    <h2 className="section-title">
                        <FormattedMessage id="registerLogin.register" />
                    </h2>

                    <input
                        type="text"
                        placeholder={intl.formatMessage({ id: "registerLogin.name" })}
                        className="input-field"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder={intl.formatMessage({ id: "registerLogin.email" })}
                        className="input-field"
                        value={emailReg}
                        onChange={(e) => setEmailReg(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder={intl.formatMessage({ id: "registerLogin.password" })}
                        className="input-field"
                        value={passReg}
                        onChange={(e) => setPassReg(e.target.value)}
                    />

                    <button className="btn-primary mt-2" onClick={handleRegister}>
                        <FormattedMessage id="registerLogin.register" />
                    </button>
                </div>

                <div className="form-section">
                    <h2 className="section-title">
                        <FormattedMessage id="registerLogin.login" />
                    </h2>

                    <input
                        type="email"
                        placeholder={intl.formatMessage({ id: "registerLogin.email" })}
                        className="input-field"
                        value={emailLog}
                        onChange={(e) => setEmailLog(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder={intl.formatMessage({ id: "registerLogin.password" })}
                        className="input-field"
                        value={passLog}
                        onChange={(e) => setPassLog(e.target.value)}
                    />

                    <button className="btn-primary mt-2" onClick={handleLogin}>
                        <FormattedMessage id="registerLogin.login" />
                    </button>
                </div>
            </div>

            {error && <p className="form-error">{error}</p>}
        </Modal>
    );
}
