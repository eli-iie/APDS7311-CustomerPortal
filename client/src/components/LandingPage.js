
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>🏦 SecureBank</h1>
              <span>International Payments Portal</span>
            </div>            <nav className="nav-links">
              <Link to="/login" className="nav-link">Customer Login</Link>
              <Link to="/employee/login" className="nav-link employee-link">Employee Portal</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h2>Secure International Payments</h2>
              <p className="hero-subtitle">
                Professional banking portal for secure international money transfers via SWIFT network
              </p>
              <p className="hero-description">
                Experience enterprise-grade security with bcrypt password hashing, input validation, 
                SSL encryption, and comprehensive attack prevention measures.
              </p>              <div className="hero-actions">
                <Link to="/login" className="btn btn-primary">
                  Customer Portal Login
                </Link>
                <Link to="/employee/login" className="btn btn-secondary">
                  Employee Portal Access
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="security-badge">
                <div className="badge-icon">🔒</div>
                <div className="badge-text">
                  <strong>Bank-Grade Security</strong>
                  <span>SSL • bcrypt • Input Validation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h3>Why Choose SecureBank?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h4>Advanced Security</h4>
              <p>Multi-layered security with bcrypt hashing, input validation, and attack prevention</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h4>SWIFT Network</h4>
              <p>Direct integration with SWIFT for reliable international money transfers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>Fast Processing</h4>
              <p>Employee verification system ensures quick and accurate payment processing</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>Audit Trail</h4>
              <p>Complete transaction history and audit logging for regulatory compliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="portal-access">
        <div className="container">
          <div className="access-grid">            <div className="access-card customer-card">
              <h4>Customer Portal</h4>
              <p>Access realistic customer accounts for international payments</p>
              <ul>
                <li>✓ Realistic demonstration accounts</li>
                <li>✓ International payment submission</li>
                <li>✓ Real-time payment tracking</li>
                <li>✓ Transaction history</li>
              </ul>
              <div className="card-actions">
                <Link to="/login" className="btn btn-outline">Customer Login</Link>
              </div>              <div className="employee-credentials">
                <small>
                  <strong>Sample Accounts:</strong><br/>
                  alexandra.mitchell / CustomerSecure2025!<br/>
                  benjamin.carter / BusinessPass2025!<br/>
                  catherine.williams / TradeSecure2025!
                </small>
              </div>
            </div>
            
            <div className="access-card employee-card">
              <h4>Employee Portal</h4>
              <p>Bank staff verification and processing system</p>
              <ul>
                <li>✓ Payment verification dashboard</li>
                <li>✓ SWIFT code validation</li>
                <li>✓ Bulk payment processing</li>
                <li>✓ Audit trail management</li>
              </ul>
              <div className="card-actions">
                <Link to="/employee/login" className="btn btn-outline">Employee Access</Link>
              </div>
              <div className="employee-credentials">
                <small>
                  <strong>Sample Accounts:</strong><br/>
                  sarah.chen / SecureManager2025! (Manager)<br/>
                  emily.watson / OfficerPass2025! (Employee)<br/>
                  michael.rodriguez / AdminSecure2025! (Admin)
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Info Section */}
      <section className="security-info">
        <div className="container">
          <h3>Enterprise Security Features</h3>
          <div className="security-grid">
            <div className="security-item">
              <strong>Password Security</strong>
              <span>bcrypt hashing with 12+ salt rounds</span>
            </div>
            <div className="security-item">
              <strong>Input Validation</strong>
              <span>RegEx patterns prevent injection attacks</span>
            </div>
            <div className="security-item">
              <strong>SSL/HTTPS</strong>
              <span>End-to-end encryption for all data</span>
            </div>
            <div className="security-item">
              <strong>Session Security</strong>
              <span>Secure tokens with auto-expiration</span>
            </div>
            <div className="security-item">
              <strong>Rate Limiting</strong>
              <span>DDoS protection and abuse prevention</span>
            </div>
            <div className="security-item">
              <strong>Audit Logging</strong>
              <span>Complete activity tracking and monitoring</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>SecureBank Portal</h4>
              <p>APDS7311 - Application Development Security</p>
              <p>International Payments Processing System</p>
            </div>
            <div className="footer-section">
              <h4>Security Compliance</h4>
              <p>✓ PCI DSS Compliant</p>
              <p>✓ GDPR Compliant</p>
              <p>✓ SWIFT Standards</p>
            </div>
            <div className="footer-section">
              <h4>System Status</h4>
              <p>🟢 All Systems Operational</p>
              <p>🔒 Security: Active</p>
              <p>📡 SWIFT: Connected</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 SecureBank International Payments Portal. All rights reserved.</p>
            <p>Developed for APDS7311 Assignment - Secure Banking Application</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
