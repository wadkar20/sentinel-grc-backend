// ============================================================
// REAL FRAMEWORK CONTROL MAPPINGS
// Based on actual SOC 2 Trust Service Criteria, ISO 27001:2022
// Annex A, and DPDP Act 2023 requirements
// ============================================================

const REAL_CONTROLS = [
  // ---------- SOC 2 — Trust Service Criteria (Security/Common Criteria) ----------
  { code: "CC1.1", name: "Demonstrates Commitment to Integrity and Ethical Values", owner: "Leadership", frameworks: ["SOC2"], category: "Control Environment" },
  { code: "CC2.1", name: "Identifies and Communicates Information Security Objectives", owner: "CISO", frameworks: ["SOC2"], category: "Communication" },
  { code: "CC3.1", name: "Specifies Suitable Risk Tolerance Objectives", owner: "Risk Team", frameworks: ["SOC2"], category: "Risk Assessment" },
  { code: "CC5.1", name: "Selects and Develops Control Activities", owner: "Security Team", frameworks: ["SOC2"], category: "Control Activities" },
  { code: "CC6.1", name: "Logical and Physical Access Controls", owner: "Security Team", frameworks: ["SOC2"], category: "Access Control" },
  { code: "CC6.6", name: "Restricts Access via Network Security (Firewalls, VPN)", owner: "Infra Team", frameworks: ["SOC2"], category: "Access Control" },
  { code: "CC6.7", name: "Restricts Transmission, Movement, and Removal of Information", owner: "Infra Team", frameworks: ["SOC2"], category: "Access Control" },
  { code: "CC7.2", name: "Monitors System Components for Anomalies", owner: "Security Team", frameworks: ["SOC2"], category: "System Operations" },
  { code: "CC7.3", name: "Evaluates Security Incidents to Determine Response", owner: "CISO", frameworks: ["SOC2"], category: "System Operations" },
  { code: "CC8.1", name: "Manages Changes to Infrastructure and Software", owner: "Engineering", frameworks: ["SOC2"], category: "Change Management" },
  { code: "CC9.1", name: "Identifies and Manages Business Disruption Risks", owner: "Operations", frameworks: ["SOC2"], category: "Risk Mitigation" },
  { code: "A1.2", name: "Backup, Recovery, and Environmental Protections", owner: "Infra Team", frameworks: ["SOC2"], category: "Availability" },

  // ---------- ISO 27001:2022 — Annex A Controls ----------
  { code: "A.5.1", name: "Policies for Information Security", owner: "CISO", frameworks: ["ISO"], category: "Organizational Controls" },
  { code: "A.5.7", name: "Threat Intelligence", owner: "Security Team", frameworks: ["ISO"], category: "Organizational Controls" },
  { code: "A.5.23", name: "Information Security for Use of Cloud Services", owner: "Infra Team", frameworks: ["ISO"], category: "Organizational Controls" },
  { code: "A.6.3", name: "Information Security Awareness, Education and Training", owner: "HR", frameworks: ["ISO"], category: "People Controls" },
  { code: "A.7.4", name: "Physical Security Monitoring", owner: "Facilities", frameworks: ["ISO"], category: "Physical Controls" },
  { code: "A.8.2", name: "Privileged Access Rights", owner: "Security Team", frameworks: ["ISO"], category: "Technological Controls" },
  { code: "A.8.5", name: "Secure Authentication (MFA)", owner: "Security Team", frameworks: ["ISO"], category: "Technological Controls" },
  { code: "A.8.9", name: "Configuration Management", owner: "Infra Team", frameworks: ["ISO"], category: "Technological Controls" },
  { code: "A.8.12", name: "Data Leakage Prevention", owner: "Security Team", frameworks: ["ISO"], category: "Technological Controls" },
  { code: "A.8.16", name: "Monitoring Activities (Logging)", owner: "Infra Team", frameworks: ["ISO"], category: "Technological Controls" },
  { code: "A.8.23", name: "Web Filtering", owner: "Infra Team", frameworks: ["ISO"], category: "Technological Controls" },
  { code: "A.8.24", name: "Use of Cryptography", owner: "Engineering", frameworks: ["ISO"], category: "Technological Controls" },

  // ---------- DPDP Act 2023 (India) ----------
  { code: "DPDP-1", name: "Notice and Consent Management", owner: "Legal", frameworks: ["DPDP"], category: "Consent" },
  { code: "DPDP-2", name: "Purpose Limitation in Data Processing", owner: "Legal", frameworks: ["DPDP"], category: "Data Processing" },
  { code: "DPDP-3", name: "Data Minimization Practices", owner: "Engineering", frameworks: ["DPDP"], category: "Data Processing" },
  { code: "DPDP-4", name: "Right to Access and Correction (Data Subject Rights)", owner: "Legal", frameworks: ["DPDP"], category: "Data Subject Rights" },
  { code: "DPDP-5", name: "Right to Erasure", owner: "Engineering", frameworks: ["DPDP"], category: "Data Subject Rights" },
  { code: "DPDP-6", name: "Data Breach Notification (within 72 hours)", owner: "CISO", frameworks: ["DPDP"], category: "Breach Management" },
  { code: "DPDP-7", name: "Data Protection Officer (DPO) Appointment", owner: "Leadership", frameworks: ["DPDP"], category: "Governance" },
  { code: "DPDP-8", name: "Cross-Border Data Transfer Safeguards", owner: "Legal", frameworks: ["DPDP"], category: "Data Transfer" },

  // ---------- RBI Cyber Security Framework ----------
  { code: "RBI-1", name: "Board-Approved Cyber Security Policy", owner: "Leadership", frameworks: ["RBI"], category: "Governance" },
  { code: "RBI-2", name: "Multi-Factor Authentication for Critical Systems", owner: "Security Team", frameworks: ["RBI"], category: "Access Control" },
  { code: "RBI-3", name: "Cyber Crisis Management Plan", owner: "CISO", frameworks: ["RBI"], category: "Incident Response" },
  { code: "RBI-4", name: "Vendor/Third-Party Risk Management", owner: "Procurement", frameworks: ["RBI"], category: "Third Party" },
  { code: "RBI-5", name: "Security Operations Center (SOC) Monitoring", owner: "Security Team", frameworks: ["RBI"], category: "Monitoring" },

  // ---------- PCI DSS v4.0 ----------
  { code: "PCI-1", name: "Install and Maintain Network Security Controls", owner: "Infra Team", frameworks: ["PCI"], category: "Network Security" },
  { code: "PCI-3", name: "Protect Stored Account Data (Encryption)", owner: "Engineering", frameworks: ["PCI"], category: "Data Protection" },
  { code: "PCI-7", name: "Restrict Access to System Components by Business Need", owner: "Security Team", frameworks: ["PCI"], category: "Access Control" },
  { code: "PCI-8", name: "Identify Users and Authenticate Access", owner: "Security Team", frameworks: ["PCI"], category: "Access Control" },
  { code: "PCI-10", name: "Log and Monitor All Access to Network Resources", owner: "Infra Team", frameworks: ["PCI"], category: "Logging" },
  { code: "PCI-11", name: "Test Security of Systems and Networks Regularly", owner: "Security Team", frameworks: ["PCI"], category: "Testing" },

  // ---------- HIPAA Security Rule ----------
  { code: "HIPAA-1", name: "Access Control (Unique User Identification)", owner: "Security Team", frameworks: ["HIPAA"], category: "Technical Safeguards" },
  { code: "HIPAA-2", name: "Audit Controls (Activity Logging)", owner: "Infra Team", frameworks: ["HIPAA"], category: "Technical Safeguards" },
  { code: "HIPAA-3", name: "Integrity Controls (Data Tampering Prevention)", owner: "Engineering", frameworks: ["HIPAA"], category: "Technical Safeguards" },
  { code: "HIPAA-4", name: "Transmission Security (Encryption in Transit)", owner: "Engineering", frameworks: ["HIPAA"], category: "Technical Safeguards" },
  { code: "HIPAA-5", name: "Workforce Security Training", owner: "HR", frameworks: ["HIPAA"], category: "Administrative Safeguards" },

  // ---------- CERT-In Guidelines ----------
  { code: "CERT-1", name: "Incident Reporting within 6 Hours", owner: "CISO", frameworks: ["CERT"], category: "Incident Response" },
  { code: "CERT-2", name: "Time Synchronization with NTP Servers", owner: "Infra Team", frameworks: ["CERT"], category: "Infrastructure" },
  { code: "CERT-3", name: "Logs Retention for 180 Days", owner: "Infra Team", frameworks: ["CERT"], category: "Logging" },
];

module.exports = { REAL_CONTROLS };