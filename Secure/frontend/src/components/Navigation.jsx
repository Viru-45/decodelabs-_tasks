import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="nav-brand">
          <span className="brand-icon">🛡️</span>
          <span className="brand-text">SecureAuth</span>
        </Link>

        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <div className="nav-user-badge">
                <span className="user-icon">👤</span>
                <span className="user-name">{user?.name || user?.email}</span>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navigation;
