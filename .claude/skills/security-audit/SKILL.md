---
name: security-audit
description: Security vulnerability assessment and remediation guidance
---

# Security Audit Skill

## Purpose
Identify security vulnerabilities, assess risk levels, and provide remediation guidance.

## Security Checklist

### Authentication & Authorization
- [ ] No hardcoded credentials or API keys
- [ ] Secure password hashing (bcrypt, argon2)
- [ ] Proper session management
- [ ] Role-based access control implemented
- [ ] Token expiration and refresh handled

### Input Validation
- [ ] All user inputs validated and sanitized
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] Command injection prevention
- [ ] File upload validation

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced for data in transit
- [ ] PII handling compliant with regulations
- [ ] Secure data deletion practices
- [ ] No sensitive data in logs

### Configuration
- [ ] Debug mode disabled in production
- [ ] Error messages don't leak sensitive info
- [ ] Security headers configured (CORS, CSP, etc.)
- [ ] Dependencies up to date
- [ ] No known vulnerable packages

### API Security
- [ ] Rate limiting implemented
- [ ] API authentication required
- [ ] Input size limits enforced
- [ ] Proper HTTP methods used

## Severity Levels

| Level | Description | Action Required |
|-------|-------------|-----------------|
| **Critical** | Exploitable vulnerability with severe impact | Immediate fix required |
| **High** | Significant vulnerability or data exposure risk | Fix within days |
| **Medium** | Moderate risk, limited exposure | Fix within weeks |
| **Low** | Minor issues, minimal risk | Fix when convenient |

## Finding Format

```
### [Vulnerability Name]

**Severity**: Critical / High / Medium / Low
**Location**: [file:line or component]
**Description**: What the vulnerability is
**Risk**: What could happen if exploited
**Remediation**: How to fix it
**References**: OWASP, CVE, or documentation links
```

## Common Vulnerability Patterns
1. **Exposed Secrets**: API keys, passwords in code or config
2. **Injection Flaws**: SQL, NoSQL, Command, LDAP injection
3. **Broken Auth**: Weak passwords, session issues, credential storage
4. **Sensitive Data Exposure**: Unencrypted data, excessive logging
5. **Security Misconfiguration**: Default settings, verbose errors
