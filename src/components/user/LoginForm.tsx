import React, { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import TextInput from "../forms/TextInput";
import { createLoginFormSchema } from "../../utils/validators";

const LoginForm: React.FC = () => {
  const { login, error: authError } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/";

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: createLoginFormSchema(),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const success = await login(values.email, values.password);
        if (success) {
          showToast("Login successful. Welcome back!", "success");
          navigate(from, { replace: true });
        }
      } catch (err) {
        console.error("Login error:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="p-6 bg-white border rounded-lg shadow-md border-secondary-200">
        <h2 className="mb-6 text-2xl font-bold text-center text-secondary-900">
          Sign In to Your Account
        </h2>

        {authError && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
            {authError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <TextInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email ? formik.errors.email : ""}
            required
            formik={false}
            size="md"
          />

          <TextInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password ? formik.errors.password : ""}
            required
            formik={false}
            size="md"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="w-4 h-4 rounded text-primary-600 border-secondary-300 focus:ring-primary-500"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-secondary-700"
              >
                Remember me
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary py-2.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-secondary-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
