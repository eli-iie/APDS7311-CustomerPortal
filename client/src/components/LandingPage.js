
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">🏦</span>
            <span className="brand-text">SecureBank</span>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-btn primary">Customer Login</Link>
            <Link to="/employee/login" className="nav-btn secondary">Employee Portal</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Secure International<br />
              <span className="gradient-text">Payment Portal</span>
            </h1>
            <p className="hero-description">
              Professional banking system with enterprise-grade security, 
              SWIFT integration, and comprehensive payment processing capabilities.
            </p>
            <div className="hero-buttons">
              <Link to="/login" className="hero-btn primary">
                <span>Access Customer Portal</span>
                <span className="btn-icon">→</span>
              </Link>
              <Link to="/employee/login" className="hero-btn outline">
                <span>Employee Login</span>
                <span className="btn-icon">🔒</span>
              </Link>
            </div>          </div>
          <div className="hero-visual">
            <div className="security-dashboard">
              <div className="dashboard-header">
                <div className="status-indicator">
                  <span className="pulse-dot"></span>
                  <span className="status-text">System Operational</span>
                </div>
                <div className="security-level">
                  <span className="level-badge">Enterprise Grade</span>
                </div>
              </div>
              
              <div className="security-metrics">
                <div className="metric-card">
                  <div className="metric-icon">🔐</div>
                  <div className="metric-info">
                    <span className="metric-value">256-bit</span>
                    <span className="metric-label">SSL Encryption</span>
                  </div>
                  <div className="metric-status active"></div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon">🔑</div>
                  <div className="metric-info">
                    <span className="metric-value">bcrypt</span>
                    <span className="metric-label">Password Hashing</span>
                  </div>
                  <div className="metric-status active"></div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon">🌐</div>
                  <div className="metric-info">
                    <span className="metric-value">SWIFT</span>
                    <span className="metric-label">Network Integration</span>
                  </div>
                  <div className="metric-status active"></div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon">🛡️</div>
                  <div className="metric-info">
                    <span className="metric-value">Active</span>
                    <span className="metric-label">Input Validation</span>
                  </div>
                  <div className="metric-status active"></div>
                </div>
              </div>
              
              <div className="dashboard-footer">
                <div className="uptime-display">
                  <span className="uptime-label">Uptime:</span>
                  <span className="uptime-value">99.9%</span>
                </div>
                <div className="last-updated">
                  <span>Last updated: Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Why Choose SecureBank?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Bank-Grade Security</h3>
              <p>Advanced encryption, secure authentication, and comprehensive audit trails</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>SWIFT Integration</h3>
              <p>Direct connection to international payment networks for reliable transfers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Processing</h3>
              <p>Streamlined workflow with real-time verification and instant notifications</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Complete Audit Trail</h3>
              <p>Full transaction logging and compliance reporting for regulatory requirements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Cards Section */}
      <section className="portals-section">
        <div className="portals-container">
          <h2 className="section-title">Choose Your Portal</h2>
          <div className="portals-grid">
            <div className="portal-card customer">
              <div className="card-icon">👤</div>
              <h3>Customer Portal</h3>
              <p>Manage your international payments with our secure customer interface</p>
              <ul className="feature-list">
                <li>International money transfers</li>
                <li>Real-time payment tracking</li>
                <li>Transaction history</li>
                <li>Account management</li>
              </ul>
              <Link to="/login" className="portal-btn">Access Customer Portal</Link>
            </div>
            <div className="portal-card employee">
              <div className="card-icon">👥</div>
              <h3>Employee Portal</h3>
              <p>Staff interface for payment verification and system administration</p>
              <ul className="feature-list">
                <li>Payment verification dashboard</li>
                <li>SWIFT code validation</li>
                <li>Bulk processing tools</li>
                <li>Audit management</li>
              </ul>
              <Link to="/employee/login" className="portal-btn">Employee Access</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      <section className="demo-section">
        <div className="demo-container">
          <div className="demo-card">
            <div className="demo-header">
              <span className="demo-icon">🎓</span>
              <h3>Educational Demo Platform</h3>
            </div>
            <p>
              This is a secure banking demonstration system developed for APDS7311. 
              Features realistic accounts and transactions for educational purposes.
            </p>
            <div className="demo-badges">
              <span className="badge">Realistic Demo Data</span>
              <span className="badge">Full Security Implementation</span>
              <span className="badge">SWIFT Integration</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>SecureBank Portal</h4>
              <p>APDS7311 - Application Development Security</p>
              <p>International Payment Processing System</p>
            </div>
            <div className="footer-section">
              <h4>Security Standards</h4>
              <p>PCI DSS Compliant</p>
              <p>GDPR Compliant</p>
              <p>SWIFT Certified</p>
            </div>
            <div className="footer-section">
              <h4>System Status</h4>
              <p><span className="status-indicator">🟢</span> All Systems Operational</p>
              <p><span className="status-indicator">🔒</span> Security Active</p>
              <p><span className="status-indicator">📡</span> SWIFT Connected</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 SecureBank International. Educational Demo Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
