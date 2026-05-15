import type React from "react";
import { AuthContext } from "../contexts/AuthContext";
import { lazy, Suspense, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../contexts/LangContext";
import { authService } from "../services/AuthService";
import { FormattedMessage } from "react-intl";
import LanguageSelector from "./LanguageSelector";

const RegisterLoginModal = lazy(() => import("./RegisterLoginModal"));

const Navbar: React.FC = () => {

    const { user } = useContext(AuthContext);
    const { locale } = useContext(LanguageContext);
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authService.signOut();
        window.location.href = "/";
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* Logo */}
                <Link to="/" className="title">
                    MiniArcade
                </Link>

                {/* Ranking */}
                <Link to="/ranking" className="link">
                    <FormattedMessage id="navbar.ranking" />
                </Link>

                <div className="flex items-center gap-4 ml-auto">
                    {/* Sin loguear */}
                    {!user && (
                        <button className="navbar-button" onClick={() => setOpenAuthModal(true)}>
                            <FormattedMessage id="navbar.register_login" />
                        </button>
                    )}

                    {user && user.rol === "ADMIN" && (
                        <Link to="/admin" className="link">
                            <FormattedMessage id="navbar.adminView" />
                        </Link>
                    )}

                    {/* Logueado */}
                    {user && (
                        <>
                            <img
                                src={user.avatar}
                                alt="avatar"
                                className="navbar-avatar"
                            />
                            <Link to="/profile" className="link">
                                <FormattedMessage id="navbar.profile" />
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="navbar-button"
                            >
                                <FormattedMessage id="navbar.logout" />
                            </button>
                        </>
                    )}

                    {/* Selector de idioma */}
                    <LanguageSelector locale={locale} />
                </div>
            </div>

            <Suspense fallback={<div className="page-loading"><FormattedMessage id="common.loading" /></div>}>
                <RegisterLoginModal
                    isOpen={openAuthModal}
                    onClose={() => {
                        if (user && user.rol === "ADMIN") navigate("/admin");
                        setOpenAuthModal(false);
                    }}
                />
            </Suspense>
        </nav>
    );
};

export default Navbar;