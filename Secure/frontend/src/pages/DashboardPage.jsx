import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name || "User"}!</h1>
          <p className="page-description">
            Your session is securely authenticated using short-lived in-memory bearer tokens.
          </p>
        </div>
        <div>
          <Link to="/profile" className="btn btn-primary">
            View Profile
          </Link>
        </div>
      </div>

      <div className="grid-cards">
        <div className="card">
          <div className="card-header">
            <span className="card-badge success">Active</span>
            <h3 className="card-title">Authentication Status</h3>
          </div>
          <p className="card-text">
            Authenticated via JSON Web Token (HS256) with a 1-hour validity window.
          </p>
          <div className="card-meta">
            <span className="meta-label">Storage:</span> In-Memory React State (Zero LocalStorage)
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-badge info">Security</span>
            <h3 className="card-title">Cryptographic Defense</h3>
          </div>
          <p className="card-text">
            Passwords are encrypted using Bcrypt with 12 salt rounds before database persistence.
          </p>
          <div className="card-meta">
            <span className="meta-label">Hash Exposure:</span> Strictly sanitized in all responses
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-badge warning">Notice</span>
            <h3 className="card-title">In-Memory Security</h3>
          </div>
          <p className="card-text">
            In accordance with zero-trust client storage guidelines, refreshing the page clears
            tokens from memory and requires re-authentication.
          </p>
          <div className="card-meta">
            <span className="meta-label">XSS Resistance:</span> High (no tokens in Web Storage)
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <h3 className="card-title mb-4">Quick Account Summary</h3>
        <dl className="summary-list">
          <div className="summary-item">
            <dt>Account ID</dt>
            <dd><code>{user?.id || "N/A"}</code></dd>
          </div>
          <div className="summary-item">
            <dt>Full Name</dt>
            <dd>{user?.name || "N/A"}</dd>
          </div>
          <div className="summary-item">
            <dt>Email Address</dt>
            <dd>{user?.email || "N/A"}</dd>
          </div>
          <div className="summary-item">
            <dt>Registered On</dt>
            <dd>
              {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "Just now"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default DashboardPage;
