import { database } from "../firebase";
import { ref, get, set, update } from "firebase/database";
import { UserProfile } from "../types";

class UserService {
  private usersRef = ref(database, "users");

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        throw new Error("User profile not found");
      }

      return {
        id: snapshot.key!,
        ...snapshot.val(),
      };
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw new Error("Failed to fetch user profile");
    }
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<void> {
    try {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, updates);
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw new Error("Failed to update user profile");
    }
  }

  async createUserProfile(
    userId: string,
    profile: Omit<UserProfile, "id">
  ): Promise<void> {
    try {
      const userRef = ref(database, `users/${userId}`);
      await set(userRef, {
        ...profile,
        id: userId,
        lastLogin: Date.now(),
      });
    } catch (error) {
      console.error("Failed to create user profile:", error);
      throw new Error("Failed to create user profile");
    }
  }
}

export const userService = new UserService();
