import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { UserProfile, Role } from "../../entities/Entities";
import { userService } from "../../services/UserService";

interface UserState {
    profile: UserProfile | null;
    users: UserProfile[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    profile: null,
    users: [],
    loading: false,
    error: null
};

export const fetchAllUsers = createAsyncThunk(
    "user/fetchAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const users = await userService.getAllUsers();
            return Object.values(users);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    "user/fetchUserProfile",
    async (uid: string, { rejectWithValue }) => {
        try {
            const profile = await userService.getUserById(uid);
            return profile;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    "user/updateUserProfile",
    async ({ uid, data }: { uid: string; data: Partial<UserProfile> }, { rejectWithValue }) => {
        try {
            await userService.updateUserProfile(uid, data);
            return { uid, data };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleUserRole = createAsyncThunk(
    "user/toggleUserRole",
    async ({ uid, rol }: { uid: string; rol: Role }, { rejectWithValue }) => {
        try {
            await userService.setUserRole(uid, rol);
            return { uid, rol };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleUserActive = createAsyncThunk(
    "user/toggleUserActive",
    async ({ uid, active }: { uid: string; active: boolean }, { rejectWithValue }) => {
        try {
            await userService.updateUserProfile(uid, { activo: active });
            return { uid, active };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    "user/deleteUser",
    async (uid: string, { rejectWithValue }) => {
        try {
            await userService.deleteUser(uid);
            return { uid };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserProfile: (state) => {
            state.profile = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.users = action.payload;
            })

            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            })

            .addCase(updateUserProfile.fulfilled, (state, action) => {
                const { uid, data } = action.payload;

                state.users = state.users.map(u =>
                    u.id === uid ? { ...u, ...data } : u
                );

                if (state.profile?.id === uid) {
                    state.profile = { ...state.profile, ...data };
                }
            })

            .addCase(toggleUserActive.fulfilled, (state, action) => {
                const { uid, active } = action.payload;
                state.users = state.users.map(u =>
                    u.id === uid ? { ...u, activo: active } : u
                );
            })

            .addCase(toggleUserRole.fulfilled, (state, action) => {
                const { uid, rol } = action.payload;
                state.users = state.users.map(u =>
                    u.id === uid ? { ...u, rol } : u
                );
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                const { uid } = action.payload;
                state.users = state.users.filter(u => u.id !== uid);
            });
    },
});

export const { clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
