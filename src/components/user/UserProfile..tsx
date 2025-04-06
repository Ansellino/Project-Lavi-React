import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { UserRepository } from "../../repositories/UserRepository";
import TextInput from "../forms/TextInput";
import Spinner from "../common/Spinner";
import { YupSchemas } from "../../utils/validators";

interface ProfileFormValues {
  username: string;
  email: string;
  name: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserProfile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useUI();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const userRepository = new UserRepository();

  // Profile form
  const profileForm = useFormik<ProfileFormValues>({
    initialValues: {
      username: user?.username || "",
      email: user?.email || "",
      name: user?.name || "",
    },
    validationSchema: Yup.object({
      username: YupSchemas.auth.username,
      email: YupSchemas.auth.email,
      name: Yup.string().required("Name is required"),
    }),
    onSubmit: async (values) => {
      if (!isAuthenticated || !user) return;

      try {
        setSaving(true);
        setError(null);

        const updated = await userRepository.update(user.id, {
          username: values.username,
          email: values.email,
          name: values.name,
        });

        if (updated) {
          showToast("Profile updated successfully", "success");
        } else {
          setError("Failed to update profile");
        }
      } catch (err) {
        console.error("Profile update error:", err);
        setError("An error occurred while updating your profile");
      } finally {
        setSaving(false);
      }
    },
    enableReinitialize: true,
  });

  // Password form
  const passwordForm = useFormik<PasswordFormValues>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: YupSchemas.auth.password,
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Please confirm your new password"),
    }),
    onSubmit: async (values) => {
      if (!isAuthenticated || !user) return;

      try {
        setSaving(true);
        setError(null);

        // Verify current password
        const currentUser = userRepository.findById(user.id);
        if (!currentUser || currentUser.password !== values.currentPassword) {
          setError("Current password is incorrect");
          setSaving(false);
          return;
        }

        const updated = await userRepository.update(user.id, {
          password: values.newPassword,
        });

        if (updated) {
          showToast("Password changed successfully", "success");
          passwordForm.resetForm();
        } else {
          setError("Failed to update password");
        }
      } catch (err) {
        console.error("Password update error:", err);
        setError("An error occurred while updating your password");
      } finally {
        setSaving(false);
      }
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userData = userRepository.findById(user.id);

        if (userData) {
          profileForm.setValues({
            username: userData.username,
            email: userData.email,
            name: userData.name || "",
          });
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load your profile data");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-secondary-900">
          Please Sign In
        </h2>
        <p className="mb-6 text-secondary-600">
          You need to be logged in to view your profile.
        </p>
        <a
          href="/login"
          className="px-4 py-2 text-white rounded-md bg-primary-600 hover:bg-primary-700"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-secondary-900">My Account</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-secondary-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "profile"
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-secondary-500 hover:text-secondary-700"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`ml-6 px-4 py-2 text-sm font-medium ${
              activeTab === "password"
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-secondary-500 hover:text-secondary-700"
            }`}
          >
            Change Password
          </button>
        </nav>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {/* Profile Form */}
      {activeTab === "profile" && (
        <form onSubmit={profileForm.handleSubmit} className="space-y-6">
          <TextInput
            label="Full Name"
            name="name"
            value={profileForm.values.name}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
            error={profileForm.touched.name ? profileForm.errors.name : ""}
            required
            formik={false}
            size="md"
          />

          <TextInput
            label="Username"
            name="username"
            value={profileForm.values.username}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
            error={
              profileForm.touched.username ? profileForm.errors.username : ""
            }
            required
            formik={false}
            size="md"
          />

          <TextInput
            label="Email Address"
            name="email"
            type="email"
            value={profileForm.values.email}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
            error={profileForm.touched.email ? profileForm.errors.email : ""}
            required
            formik={false}
            size="md"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 text-white rounded-md bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400"
              disabled={saving || !profileForm.dirty || !profileForm.isValid}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* Password Form */}
      {activeTab === "password" && (
        <form onSubmit={passwordForm.handleSubmit} className="space-y-6">
          <TextInput
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordForm.values.currentPassword}
            onChange={passwordForm.handleChange}
            onBlur={passwordForm.handleBlur}
            error={
              passwordForm.touched.currentPassword
                ? passwordForm.errors.currentPassword
                : ""
            }
            required
            formik={false}
            size="md"
          />

          <TextInput
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordForm.values.newPassword}
            onChange={passwordForm.handleChange}
            onBlur={passwordForm.handleBlur}
            error={
              passwordForm.touched.newPassword
                ? passwordForm.errors.newPassword
                : ""
            }
            helperText="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."
            required
            formik={false}
            size="md"
          />

          <TextInput
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordForm.values.confirmPassword}
            onChange={passwordForm.handleChange}
            onBlur={passwordForm.handleBlur}
            error={
              passwordForm.touched.confirmPassword
                ? passwordForm.errors.confirmPassword
                : ""
            }
            required
            formik={false}
            size="md"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 text-white rounded-md bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400"
              disabled={saving || !passwordForm.dirty || !passwordForm.isValid}
            >
              {saving ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
