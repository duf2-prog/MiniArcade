import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProfilePage from "../../pages/ProfilePage";
import { AuthContext } from "../../contexts/AuthContext";
import userReducer from "../../store/slices/UserSlice";
import { Role } from "../../entities/Entities";

vi.mock("react-intl", async () => {
    const actual = await vi.importActual<any>("react-intl");
    return {
        ...actual,
        FormattedMessage: ({ id }: any) => <span>{id}</span>,
        FormattedDate: ({ value }: any) => <span>{value.toISOString()}</span>
    };
});

vi.mock("../../components/Table", () => ({
    __esModule: true,
    default: () => <div>mock-table</div>
}));

vi.mock("../../services/RankingService", () => ({
    rankingService: {
        getScoresByUser: vi.fn().mockResolvedValue([
            { juegoId: "1", puntuacion: 100, fechaRegistro: new Date().toISOString(), usuarioId: "abc" }
        ]),
        getScoresByGame: vi.fn().mockResolvedValue([])
    }
}));

import gameReducer from "../../store/slices/GameSlice";

function createStore() {
    return configureStore({
        reducer: {
            user: userReducer,
            games: gameReducer
        },
        preloadedState: {
            user: {
                profile: null,
                users: [],
                loading: false,
                error: null
            },
            games: {
                games: [],
                loading: false,
                game: null,
                error: null
            }
        }
    });
}

const messages = {
    "profile.title": "Profile",
    "profile.subtitle": "Your info",
    "profile.username": "Username",
    "profile.email": "Email",
    "profile.avatar": "Avatar",
    "profile.creationDate": "Created",
    "profile.myScores": "My scores",
    "common.save": "Save"
};

describe("ProfilePage", () => {

    it("renderiza y carga la tabla", async () => {

        const mockUser = {
            id: "abc",
            nombre: "Daniel",
            email: "daniel@test.com",
            avatar: "avatar.png",
            fechaRegistro: new Date().toISOString(),
            rol: Role.USER,
            activo: true
        };

        const store = createStore();

        render(
            <Provider store={store}>
                <IntlProvider locale="es" messages={messages}>
                    <AuthContext.Provider value={{ user: mockUser, setUser: vi.fn(), loading: false }}>
                        <ProfilePage />
                    </AuthContext.Provider>
                </IntlProvider>
            </Provider>
        );

        expect(await screen.findByText("mock-table")).toBeInTheDocument();

        expect(screen.getByText("profile.title")).toBeInTheDocument();
        expect(screen.getByText("profile.subtitle")).toBeInTheDocument();
        expect(screen.getByText("profile.myScores")).toBeInTheDocument();
    });
});
