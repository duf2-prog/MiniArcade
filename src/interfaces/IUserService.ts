import type { UserProfile } from "../entities/Entities";
import type { Role } from "../entities/Entities";

export interface IUserService {
    getAllUsers(): Promise<{ [uid: string]: UserProfile }>;
    getUserById(uid: string): Promise<UserProfile>;
    createUser(profile: UserProfile): Promise<void>;
    updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void>;
    setUserRole(uid: string, role: Role): Promise<void>;
    deleteUser(uid: string): Promise<void>;
}