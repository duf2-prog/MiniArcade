import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminPage from "../../pages/AdminPage";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import * as UserSlice from "../../store/slices/UserSlice";
import * as GameSlice from "../../store/slices/GameSlice";
import userReducer from "../../store/slices/UserSlice";
import gameReducer from "../../store/slices/GameSlice";
import { Role } from "../../entities/Entities";
import { IntlProvider } from "react-intl";

vi.mock("../../components/Table", () => ({
    __esModule: true,
    default: ({ columns, data }: { columns: any[]; data: any[] }) => (
        <table>
            <thead>
                <tr>
                    {columns.map((c: any) => (
                        <th key={c.key} onClick={c.onClick}>
                            {c.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row: any, i: number) => (
                    <tr key={i}>
                        {columns.map((c: any) => (
                            <td key={c.key}>
                                {row[c.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}));


const messages = {
    "admin.title": "Admin",
    "admin.users": "Users",
    "admin.games": "Games",
    "admin.total": "Total",
    "admin.active": "Active",
    "admin.inactive": "Inactive",
    "admin.disable": "Disable",
    "admin.enable": "Enable",
    "admin.makeUser": "Make User",
    "admin.makeAdmin": "Make Admin",
    "admin.delete": "Delete",
    "admin.username": "Username",
    "admin.email": "Email",
    "admin.role": "Role",
    "admin.actions": "Actions",
    "admin.gameName": "Game Name",
    "admin.description": "Description",
    "common.loading": "Loading"
};

function createStore(initialUsers: any[], initialGames: any[]) {
    const preloadedState = {
        user: {
            users: initialUsers,
            loading: false,
            profile: null,
            error: null
        },
        games: {
            games: initialGames,
            loading: false,
            game: null,
            error: null
        }
    };

    return configureStore({
        reducer: {
            user: userReducer,
            games: gameReducer
        },
        preloadedState
    });
}

describe("AdminPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("despacha fetchAllUsers y fetchAllGames al montar", () => {
        const spyUsers = vi.spyOn(UserSlice, "fetchAllUsers");
        const spyGames = vi.spyOn(GameSlice, "fetchAllGames");

        const store = createStore([], []);

        render(
            <Provider store={store}>
                <IntlProvider locale="es" messages={messages}>
                    <AdminPage />
                </IntlProvider>
            </Provider>
        );

        expect(spyUsers).toHaveBeenCalledTimes(1);
        expect(spyGames).toHaveBeenCalledTimes(1);
    });


    it("muestra tabla de usuarios al pulsar Users", async () => {
        const store = createStore(
            [{ id: "1", nombre: "Daniel", email: "d@d.com", rol: "USER", activo: true }],
            []
        );

        render(
            <Provider store={store}>
                <IntlProvider locale="es" messages={messages}>
                    <AdminPage />
                </IntlProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText("Users"));

        expect(await screen.findByText("admin.username")).toBeInTheDocument();
    });

    it("muestra tabla de juegos al pulsar Games", async () => {
        const store = createStore(
            [],
            [{ id: "g1", nombre: "test", descripcion: "desc", activo: true }]
        );

        render(
            <Provider store={store}>
                <IntlProvider locale="es" messages={messages}>
                    <AdminPage />
                </IntlProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText("Games"));

        expect(await screen.findByText("admin.gameName")).toBeInTheDocument();
    });

    it("ejecuta toggleUserActive al pulsar el botón correspondiente", () => {
        const spy = vi.spyOn(UserSlice, "toggleUserActive");

        const store = createStore(
            [
                { id: "1", nombre: "Alba", email: "alba@gmail.com", rol: Role.USER, activo: true }
            ],
            []
        );

        render(
            <Provider store={store}>
                <IntlProvider locale="es" messages={messages}>
                    <AdminPage />
                </IntlProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText("Users"));
        fireEvent.click(screen.getAllByText("Disable")[0]);

        expect(spy).toHaveBeenCalledWith({ uid: "1", active: false });
    });


    it("ejecuta toggleUserRole al pulsar el botón correspondiente", () => {
        const spy = vi.spyOn(UserSlice, "toggleUserRole");

        const store = createStore(
            [
                { id: "1", nombre: "Alba", email: "alba@gmail.com", rol: Role.USER, activo: true }
            ],
            []
        );

        render(
            <Provider store={store}>
                <IntlProvider locale="es" messages={messages}>
                    <AdminPage />
                </IntlProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText("Users"));
        fireEvent.click(screen.getAllByText("Make Admin")[0]);

        expect(spy).toHaveBeenCalledWith({ uid: "1", rol: Role.ADMIN });
    });


    it("ejecuta deleteUser al pulsar el botón correspondiente", () => {
        const spy = vi.spyOn(UserSlice, "deleteUser");

        const store = createStore(
            [
                { id: "1", nombre: "Alba", email: "alba@gmail.com", rol: Role.USER, activo: true }
            ],
            []
        );

        render(
            <Provider store={store}>
                <IntlProvider locale="es" messages={messages}>
                    <AdminPage />
                </IntlProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText("Users"));
        fireEvent.click(screen.getAllByText("Delete")[0]);

        expect(spy).toHaveBeenCalledWith("1");
    });


    it("ejecuta updateGame al pulsar el botón correspondiente", () => {
        const spy = vi.spyOn(GameSlice, "updateGame");

        const store = createStore(
            [],
            [
                { id: "g1", nombre: "clicker_challenger.name", descripcion: "clicker_challenger.description", activo: true }
            ]
        );

        render(
            <Provider store={store}>
                <IntlProvider locale="es" messages={messages}>
                    <AdminPage />
                </IntlProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText("Games"));
        fireEvent.click(screen.getAllByText("Disable")[0]);

        expect(spy).toHaveBeenCalledWith({ id: "g1", data: { activo: false } });
    });

});
