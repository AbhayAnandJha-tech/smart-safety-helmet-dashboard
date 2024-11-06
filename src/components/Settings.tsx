import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/UserService";
import { UserProfile } from "../types";
import "../styles/Settings.css";

export const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, [currentUser]);

  const loadUserProfile = async () => {
    if (!currentUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const userProfile = await userService.getUserProfile(currentUser.uid);
      setProfile({
        ...userProfile,
        emailNotifications: userProfile.emailNotifications ?? true,
        smsNotifications: userProfile.smsNotifications ?? false,
      });
      setError(null);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !currentUser) return;

    try {
      await userService.updateUserProfile(currentUser.uid, profile);
      setError(null);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <div>Please log in to access settings</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="settings">
      <h2>User Settings</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleUpdateProfile}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={profile.phoneNumber || ""}
            onChange={(e) =>
              setProfile({ ...profile, phoneNumber: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={profile.emailNotifications}
              onChange={(e) =>
                setProfile({ ...profile, emailNotifications: e.target.checked })
              }
            />
            Email Notifications
          </label>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={profile.smsNotifications}
              onChange={(e) =>
                setProfile({ ...profile, smsNotifications: e.target.checked })
              }
            />
            SMS Notifications
          </label>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};
