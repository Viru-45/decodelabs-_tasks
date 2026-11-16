import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout.jsx";
import { useAuth } from "../context/useAuth.js";

export function RegisterPage() {
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      errs.name = "Full name is required.";
    } else if (trimmedName.length > 100) {
      errs.name = "Name must not exceed 100 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    const passwordLen = formData.password.length;
    const byteLength = new TextEncoder().encode(formData.password).length;
    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (passwordLen < 12) {
      errs.password = "Password must be at least 12 characters.";
    } else if (byteLength > 72) {
      errs.password = "Password must not exceed 72 bytes.";
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Auto login upon successful registration
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join SecureAuth with strong cryptographic security"
    >
      {apiError && (
        <div className="alert alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="form-stack">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className={`form-input ${errors.name ? "input-error" : ""}`}
            placeholder="Jane Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`form-input ${errors.email ? "input-error" : ""}`}
            placeholder="jane@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className={`form-input ${errors.password ? "input-error" : ""}`}
            placeholder="At least 12 characters"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
          <span className="form-hint">
            Must be 12 to 72 characters with strong entropy.
          </span>
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="btn-spinner-text">Creating account...</span>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="link-primary">
            Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
