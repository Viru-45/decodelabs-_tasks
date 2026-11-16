export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge">
            <span role="img" aria-label="shield">🛡️</span>
          </div>
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        </div>
        <div className="auth-body">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;

