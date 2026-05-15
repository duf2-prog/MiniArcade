import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/Store";
import { fetchAllUsers, toggleUserActive, toggleUserRole, deleteUser } from "../store/slices/UserSlice";
import { fetchAllGames, updateGame } from "../store/slices/GameSlice";
import { Role } from "../entities/Entities";
import { sortByField } from "../utils/SortByField";
import { useTableOrder } from "../hooks/UseTableOrder";
import { FormattedMessage } from "react-intl";

const Table = lazy(() => import("../components/Table"));

export default function AdminPage() {
    const dispatch = useDispatch<AppDispatch>();

    const users = useSelector((state: RootState) => state.user.users);
    const games = useSelector((state: RootState) => state.games.games);

    const loadingUsers = useSelector((state: RootState) => state.user.loading);
    const loadingGames = useSelector((state: RootState) => state.games.loading);

    const [selected, setSelected] = useState<"users" | "games" | null>(null);

    const userOrder = useTableOrder<"nombre" | "email" | "rol" | "activo">("nombre");
    const gameOrder = useTableOrder<"nombre" | "descripcion" | "activo">("nombre");

    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(fetchAllGames());
    }, [dispatch]);

    const sortedUsers = sortByField(users, userOrder.orderField, userOrder.orderDirection);
    const sortedGames = sortByField(games, gameOrder.orderField, gameOrder.orderDirection);

    const userRows = sortedUsers.map(u => ({
        ...u,
        activo: (
            <span className={`status-badge ${u.activo ? "status-active" : "status-inactive"}`}>
                <FormattedMessage id={u.activo ? "admin.active" : "admin.inactive"} />
            </span>
        ),
        actions: (
            <div className="table-actions">

                <button
                    className="action-btn action-toggle"
                    onClick={() => {
                        dispatch(toggleUserActive({ uid: u.id, active: !u.activo }));
                    }}
                >
                    <FormattedMessage id={u.activo ? "admin.disable" : "admin.enable"} />
                </button>

                <button
                    className="action-btn action-role"
                    onClick={() => {
                        dispatch(toggleUserRole({ uid: u.id, rol: u.rol === Role.ADMIN ? Role.USER : Role.ADMIN }));
                    }}
                >
                    {u.rol === Role.ADMIN
                        ? <FormattedMessage id="admin.makeUser" />
                        : <FormattedMessage id="admin.makeAdmin" />}
                </button>

                <button
                    className="action-btn action-delete"
                    onClick={() => {
                        dispatch(deleteUser(u.id));
                    }}
                >
                    <FormattedMessage id="admin.delete" />
                </button>
            </div>
        )
    }));

    const gameRows = sortedGames.map(g => ({
        ...g,
        activo: (
            <span className={`status-badge ${g.activo ? "status-active" : "status-inactive"}`}>
                <FormattedMessage id={g.activo ? "admin.active" : "admin.inactive"} />
            </span>
        ),
        actions: (
            <div className="table-actions">
                <button
                    className="action-btn action-toggle"
                    onClick={() => {
                        dispatch(updateGame({ id: g.id, data: { activo: !g.activo } }));
                    }}
                >
                    <FormattedMessage id={g.activo ? "admin.disable" : "admin.enable"} />
                </button>
            </div>
        )
    }));

    return (
        <div className="page-container">

            <h1 className="page-title">
                <FormattedMessage id="admin.title" />
            </h1>

            <div className="admin-cards">
                <div
                    className="admin-card"
                    onClick={() => {
                        setSelected("users");
                    }}
                >
                    <h2><FormattedMessage id="admin.users" /></h2>
                    <p><FormattedMessage id="admin.total" />: {users.length}</p>
                </div>

                <div
                    className="admin-card"
                    onClick={() => {
                        setSelected("games");
                    }}
                >
                    <h2><FormattedMessage id="admin.games" /></h2>
                    <p><FormattedMessage id="admin.total" />: {games.length}</p>
                </div>
            </div>

            {selected === "users" && (
                <div className="admin-table">
                    <Suspense fallback={<div className="page-loading"><FormattedMessage id="common.loading" />...</div>}>
                        <Table
                            columns={[
                                { key: "nombre", label: "admin.username", onClick: () => userOrder.toggleOrder("nombre"), order: userOrder.orderField === "nombre" ? userOrder.orderDirection : null },
                                { key: "email", label: "admin.email", onClick: () => userOrder.toggleOrder("email"), order: userOrder.orderField === "email" ? userOrder.orderDirection : null },
                                { key: "rol", label: "admin.role", onClick: () => userOrder.toggleOrder("rol"), order: userOrder.orderField === "rol" ? userOrder.orderDirection : null },
                                { key: "activo", label: "admin.active", onClick: () => userOrder.toggleOrder("activo"), order: userOrder.orderField === "activo" ? userOrder.orderDirection : null },
                                { key: "actions", label: "admin.actions" }
                            ]}
                            data={userRows}
                            loading={loadingUsers}
                        />
                    </Suspense>
                </div>
            )}

            {selected === "games" && (
                <div className="admin-table">
                    <Suspense fallback={<div className="page-loading"><FormattedMessage id="common.loading" /></div>}>
                        <Table
                            columns={[
                                { key: "nombre", label: "admin.gameName", onClick: () => gameOrder.toggleOrder("nombre"), order: gameOrder.orderField === "nombre" ? gameOrder.orderDirection : null, render: (g) => <FormattedMessage id={`game.${g.nombre}`} /> },
                                { key: "descripcion", label: "admin.description", onClick: () => gameOrder.toggleOrder("descripcion"), order: gameOrder.orderField === "descripcion" ? gameOrder.orderDirection : null, render: (g) => <FormattedMessage id={`game.${g.descripcion}`} /> },
                                { key: "activo", label: "admin.active", onClick: () => gameOrder.toggleOrder("activo"), order: gameOrder.orderField === "activo" ? gameOrder.orderDirection : null },
                                { key: "actions", label: "admin.actions" }
                            ]}
                            data={gameRows}
                            loading={loadingGames}
                        />
                    </Suspense>
                </div>
            )}
        </div>
    );
}
