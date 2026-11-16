import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth.js";

export function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await refreshProfile();
      if (data) {
        setProfile(data);
      }
    } catch (err) {
      setError(err.message || "Failed to load latest profile information.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-description">
            Verified public user profile fetched directly from the protected API.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-outline"
            onClick={loadData}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "↻ Refresh Data"}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-6" role="alert">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
          <button type="button" className="btn btn-sm btn-outline ml-auto" onClick={loadData}>
            Retry
          </button>
        </div>
      )}

      <div className="grid-two-column">
        <div className="card">
          <div className="profile-badge-row">
            <div className="avatar-circle">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="profile-name">{profile?.name || "Authenticated User"}</h2>
              <span className="profile-email">{profile?.email}</span>
            </div>
          </div>

          <div className="divider"></div>

          <dl className="summary-list">
            <div className="summary-item">
              <dt>User ID (CUID)</dt>
              <dd>
                <code>{profile?.id || "N/A"}</code>
              </dd>
            </div>
            <div className="summary-item">
              <dt>Email Verified</dt>
              <dd>
                <span className="text-success font-medium">Standard Normalized (lowercase)</span>
              </dd>
            </div>
            <div className="summary-item">
              <dt>Created Timestamp</dt>
              <dd>
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleString(undefined, {
                      dateStyle: "long",
                      timeStyle: "medium",
                    })
                  : "N/A"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card">
          <h3 className="card-title mb-3">Security & Privacy Checklist</h3>
          <ul className="security-checklist">
            <li>
              <span className="check-icon">✓</span>
              <div>
                <strong>Password Protection:</strong>
                <p>Hashed with bcrypt (work factor 12) before persistence.</p>
              </div>
            </li>
            <li>
              <span className="check-icon">✓</span>
              <div>
                <strong>Sanitized Responses:</strong>
                <p>Password hashes are stripped from all API outputs.</p>
              </div>
            </li>
            <li>
              <span className="check-icon">✓</span>
              <div>
                <strong>Bearer Token Scope:</strong>
                <p>HS256 signature verified against environment secret on every call.</p>
              </div>
            </li>
            <li>
              <span className="check-icon">✓</span>
              <div>
                <strong>Ephemerality:</strong>
                <p>Token lives only in volatile React memory; no disk footprint.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
