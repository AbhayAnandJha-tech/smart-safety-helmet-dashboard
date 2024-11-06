import { auth, database } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseAuthStateChanged,
  User,
} from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { UserProfile, LoginCredentials } from "../types";

export class AuthService {
  async login({ email, password }: LoginCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Failed to login");
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Failed to logout");
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile> {
    try {
      const snapshot = await get(ref(database, `users/${uid}`));
      if (!snapshot.exists()) {
        throw new Error("User profile not found");
      }
      return snapshot.val() as UserProfile;
    } catch (error) {
      console.error("Failed to get user profile:", error);
      throw new Error("Failed to get user profile");
    }
  }

  async updateUserProfile(
    uid: string,
    profile: Partial<UserProfile>
  ): Promise<void> {
    try {
      await set(ref(database, `users/${uid}`), profile);
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw new Error("Failed to update user profile");
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseAuthStateChanged(auth, callback);
  }
}

export const authService = new AuthService();
