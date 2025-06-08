## Project Requirements Document: International Payment System

**Version:** 1.0
**Date:** June 7, 2025

**1. Introduction**

This document outlines the requirements for the International Payment System, a two-part application consisting of a Customer Portal and an Employee Portal. The system will facilitate international payments by customers and allow bank employees to verify and process these payments. Security, reliability, and a robust DevSecOps pipeline are key priorities.

**2. Overall Project Goal**

To develop a secure, two-part international payment system:
    1.  A **Customer Portal** (React frontend and API) allowing registered customers to make international payments.
    2.  An **Employee Portal** (React frontend and API) for bank staff to securely log in, review customer payments, verify details, and submit them to SWIFT.

**3. User Roles**
    *   **Customer:** External bank clients who register and use the system to make international payments.
    *   **Employee:** Internal bank staff (pre-registered) who use the system to manage and process payments. Specific employee roles (e.g., 'manager', 'admin') may have different access levels.

**4. Functional Requirements**

    **4.1. Customer Portal**
        *   **FR-C1: User Registration:** Customers must be able to register by providing their full name, ID number, account number, and a password.
        *   **FR-C2: User Login:** Registered customers must be able to log in using their username, account number, and password.
        *   **FR-C3: Payment Initiation:**
            *   FR-C3.1: Logged-in customers must be able to enter the payment amount.
            *   FR-C3.2: Logged-in customers must be able to select the payment currency.
            *   FR-C3.3: Logged-in customers must be able to choose a payment provider (default/primary: SWIFT).
            *   FR-C3.4: Logged-in customers must be able to enter the payee's account information and SWIFT code.
        *   **FR-C4: Payment Submission:** Logged-in customers must be able to finalize and submit the payment ("Pay Now" button).
        *   **FR-C5: Transaction Storage:** Submitted payment transactions must be securely stored in the database.

    **4.2. Employee Portal**
        *   **FR-E1: Static Login / Pre-configured Accounts:**
            *   FR-E1.1: Employee accounts must be pre-configured in the system.
            *   FR-E1.2: No public registration process for employees.
            *   FR-E1.3: Authorized employees must be able to log in securely.
        *   **FR-E2: Payment Review:** Logged-in employees must be able to view international payments submitted by customers.
        *   **FR-E3: Payment Verification:** Logged-in employees must be able to:
            *   FR-E3.1: Check payee's account information.
            *   FR-E3.2: Verify the correctness of the SWIFT code.
            *   FR-E3.3: Mark transactions as "verified."
        *   **FR-E4: SWIFT Submission:** Logged-in employees (with appropriate roles, e.g., manager/admin) must be able to submit verified transactions to SWIFT (simulated process).
        *   **FR-E5: Audit Trail Access (Admin):** Employees with 'admin' role must be able to view an audit trail of employee actions.

    **4.3. System-Wide**
        *   **FR-S1: Data Flow:** Information processed on the customer portal (e.g., new payments) must accurately appear and be actionable on the employee portal.

**5. Non-Functional Requirements (Security, Performance, Usability)**

    **5.1. Security**
        *   **NFR-SEC1: Password Security:**
            *   NFR-SEC1.1: All user (customer and employee) passwords must be stored using strong hashing and salting mechanisms (e.g., bcrypt). (Customer Portal: 8-10 Marks; Employee Portal: 15-20 Marks)
        *   **NFR-SEC2: Input Whitelisting & Validation:**
            *   NFR-SEC2.1: All user inputs on both client and server-side must be strictly validated using RegEx patterns and other appropriate methods to prevent injection attacks (e.g., NoSQL injection, XSS). (Customer Portal: 8-10 Marks)
        *   **NFR-SEC3: Secure Data in Transit (SSL/TLS):**
            *   NFR-SEC3.1: A valid SSL certificate and key must be generated and used.
            *   NFR-SEC3.2: All web traffic for both portals must be served exclusively over HTTPS. (Customer Portal: 15-20 Marks)
        *   **NFR-SEC4: Protection Against Common Attacks:**
            *   NFR-SEC4.1: Implement measures to protect against common web vulnerabilities. (Customer Portal: 20-30 Marks)
            *   NFR-SEC4.2: (Employee Portal Specific) Protect against:
                *   Session Jacking (e.g., secure session management, HttpOnly/Secure cookies, token validation).
                *   Clickjacking (e.g., `X-Frame-Options` header, CSP frame-ancestors).
                *   SQL/NoSQL Injection (already covered by NFR-SEC2.1, but re-emphasized).
                *   Cross-Site Scripting (XSS) (input sanitization, output encoding, Content Security Policy).
                *   Man-in-the-Middle (MitM) (enforce HTTPS, HSTS).
                *   Distributed Denial of Service (DDoS) (e.g., rate limiting, connection limits).
        *   **NFR-SEC5: Secure Session Management:** Implement secure session management practices, including timely session expiration and secure token handling.
        *   **NFR-SEC6: Access Control:** Enforce role-based access control for employee functionalities (e.g., only managers/admins can submit to SWIFT or view full audit trails).

    **5.2. DevSecOps Pipeline**
        *   **NFR-DSO1: Version Control:** The project must be managed in a GitHub repository.
        *   **NFR-DSO2: Continuous Integration (CI):** A CI pipeline (CircleCI) must be configured and triggered whenever code is pushed.
        *   **NFR-DSO3: Static Application Security Testing (SAST):** The CI pipeline must include SonarCloud/SonarQube scans to check for security hotspots, vulnerabilities, and code smells. (Customer Portal: 5-7 Marks; Employee Portal: 10-20 Marks for "Static application testing")
        *   **NFR-DSO4: Software Composition Analysis (SCA):** The CI pipeline (or related tooling) should check for vulnerabilities in third-party dependencies. (Employee Portal: 10-20 Marks for "Software composition analysis")
        *   **NFR-DSO5: API (Security) Testing:** The CI pipeline should include tests for API security (e.g., authentication, authorization, input validation at API level). (Employee Portal: 10-20 Marks for "API testing")

    **5.3. Overall Functioning & Reliability**
        *   **NFR-FUNC1: Correct Configuration & Security:** The web application (both portals) must be correctly configured and secured.
        *   **NFR-FUNC2: Data Integrity & Flow:** Information processed on the customer portal must appear correctly and be usable on the staff portal. (Employee Portal: 10-14 Marks for basic, 15-20 for exceptional)

**6. Technology Stack**
    *   Frontend: React
    *   Backend API: Node.js, Express.js
    *   Database: MongoDB (or other secure database)
    *   CI/CD: GitHub, CircleCI
    *   Security Scanning: SonarCloud

**7. Deliverables**
    *   DEL1: Fully functional and secure Customer Portal (React frontend and API).
    *   DEL2: Fully functional and secure Employee Portal (React frontend and API).
    *   DEL3: GitHub repository with the complete source code and CircleCI configuration.
    *   DEL4: Video demonstration of the Customer Portal.
    *   DEL5: Video demonstration of the Employee Portal.
