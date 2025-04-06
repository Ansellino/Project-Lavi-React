import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Add this import
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import TextInput from "../forms/TextInput";
import Checkbox from "../forms/Checkbox";
import { createRegistrationFormSchema } from "../../utils/validators";

interface RegistrationValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const RegisterForm: React.FC = () => {
  const { register, error: authError } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<RegistrationValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    validationSchema: createRegistrationFormSchema().shape({
      agreeToTerms:
        createRegistrationFormSchema().fields.agreeToTerms ??
        Yup.boolean().oneOf(
          // Use the imported Yup here
          [true],
          "You must agree to the terms and conditions"
        ),
    }),
    onSubmit: async (values) => {
      if (!values.agreeToTerms) {
        showToast("Please agree to the terms and conditions", "error");
        return;
      }

      setIsSubmitting(true);
      try {
        const success = await register(
          values.username,
          values.email,
          values.password
        );
        if (success) {
          showToast("Registration successful! Welcome aboard.", "success");
          navigate("/");
        }
      } catch (err) {
        console.error("Registration error:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="p-6 bg-white border rounded-lg shadow-md border-secondary-200">
        <h2 className="mb-6 text-2xl font-bold text-center text-secondary-900">
          Create an Account
        </h2>

        {authError && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
            {authError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <TextInput
            label="Username"
            name="username"
            type="text"
            placeholder="johndoe"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username ? formik.errors.username : ""}
            required
            formik={false}
            size="md"
          />

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
            helperText="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password ? formik.errors.password : ""}
            required
            formik={false}
            size="md"
          />

          <TextInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword
                ? formik.errors.confirmPassword
                : ""
            }
            required
            formik={false}
            size="md"
          />

          <Checkbox
            label={
              <span>
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Privacy Policy
                </Link>
              </span>
            }
            name="agreeToTerms"
            checked={formik.values.agreeToTerms}
            onChange={formik.handleChange}
            error={
              formik.touched.agreeToTerms ? formik.errors.agreeToTerms : ""
            }
            required
          />

          <button
            type="submit"
            className="w-full btn btn-primary py-2.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-secondary-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
