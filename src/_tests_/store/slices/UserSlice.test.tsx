import { Role } from "../../../entities/Entities";
import reducer, {
    fetchAllUsers,
    fetchUserProfile,
    updateUserProfile,
    toggleUserRole,
    toggleUserActive,
    deleteUser,
    clearUserProfile
} from "../../../store/slices/UserSlice";

import { describe, it, expect } from "vitest";

describe("UserSlice reducer", () => {
    const initialState = {
        profile: null,
        users: [],
        loading: false,
        error: null
    };

    const mockUser = {
        id: "1",
        nombre: "Daniel",
        email: "daniel@test.com",
        rol: Role.USER,
        activo: true,
        fechaRegistro: "2024-01-01"
    };

    const mockUser2 = {
        id: "2",
        nombre: "Ana",
        email: "ana@test.com",
        rol: Role.ADMIN,
        activo: true,
        fechaRegistro: "2024-01-01"
    };

    it("clearUserProfile limpia profile", () => {
        const prevState = {
            ...initialState,
            profile: mockUser
        };

        const state = reducer(prevState, clearUserProfile());

        expect(state.profile).toBeNull();
    });

    it("fetchAllUsers.fulfilled guarda usuarios", () => {
        const action = {
            type: fetchAllUsers.fulfilled.type,
            payload: [mockUser, mockUser2]
        };

        const state = reducer(initialState, action);

        expect(state.users).toEqual([mockUser, mockUser2]);
    });

    it("fetchUserProfile.fulfilled guarda profile", () => {
        const action = {
            type: fetchUserProfile.fulfilled.type,
            payload: mockUser
        };

        const state = reducer(initialState, action);

        expect(state.profile).toEqual(mockUser);
    });

    it("updateUserProfile.fulfilled actualiza users y profile", () => {
        const prevState = {
            ...initialState,
            profile: mockUser,
            users: [mockUser, mockUser2]
        };

        const action = {
            type: updateUserProfile.fulfilled.type,
            payload: {
                uid: "1",
                data: { nombre: "Daniel Updated" }
            }
        };

        const state = reducer(prevState, action);

        expect(state.users[0].nombre).toBe("Daniel Updated");
        expect(state.profile?.nombre).toBe("Daniel Updated");
    });

    it("toggleUserActive.fulfilled actualiza activo", () => {
        const prevState = {
            ...initialState,
            users: [mockUser]
        };

        const action = {
            type: toggleUserActive.fulfilled.type,
            payload: {
                uid: "1",
                active: false
            }
        };

        const state = reducer(prevState, action);

        expect(state.users[0].activo).toBe(false);
    });

    it("toggleUserRole.fulfilled actualiza rol", () => {
        const prevState = {
            ...initialState,
            users: [mockUser]
        };

        const action = {
            type: toggleUserRole.fulfilled.type,
            payload: {
                uid: "1",
                rol: Role.ADMIN
            }
        };

        const state = reducer(prevState, action);

        expect(state.users[0].rol).toBe("ADMIN");
    });

    it("deleteUser.fulfilled elimina usuario", () => {
        const prevState = {
            ...initialState,
            users: [mockUser, mockUser2]
        };

        const action = {
            type: deleteUser.fulfilled.type,
            payload: {
                uid: "1"
            }
        };

        const state = reducer(prevState, action);

        expect(state.users).toEqual([mockUser2]);
    });
});