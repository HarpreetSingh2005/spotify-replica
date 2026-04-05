import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./AuthModal.css";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLoginView) {
        await login(formData.username || formData.email, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError("");
    setFormData({ username: "", email: "", password: "" });
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={closeAuthModal}>
          &times;
        </button>
        <h2 className="auth-modal-title">
          {isLoginView ? "Log In to Listen" : "Sign Up to Listen"}
        </h2>
        {error && <p className="auth-modal-error">{error}</p>}
        
        <form onSubmit={handleSubmit} className="auth-modal-form">
          {!isLoginView && (
            <div className="auth-input-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required={!isLoginView}
              />
            </div>
          )}
          
          <div className="auth-input-group">
            <label>{isLoginView ? "Email or Username" : "Email"}</label>
            <input
              type={isLoginView && !formData.email.includes("@") ? "text" : "email"}
              name={isLoginView ? "username" : "email"}
              value={isLoginView ? formData.username : formData.email}
              onChange={handleChange}
              placeholder={isLoginView ? "Enter email or username" : "Enter email"}
              required
            />
          </div>
          
          <div className="auth-input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Loading..." : isLoginView ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="auth-modal-switch">
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <span onClick={toggleView}>
            {isLoginView ? "Sign up for free" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
