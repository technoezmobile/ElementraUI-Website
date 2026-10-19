# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

The ElementraUI team takes the security of our platform, sandbox runtime, and users seriously.

If you believe you have found a security vulnerability in ElementraUI (including iframe sandboxing escapes, cross-site scripting risks, or unsafe prototype pollution):

1. **Do not** report security vulnerabilities via public GitHub issues.
2. Email full technical details and proof-of-concept steps to **security@elementraui.dev**.
3. We will acknowledge receipt of your vulnerability report within 48 hours and provide a regular status update on the mitigation.

Detailed architectural security specifications, iframe containment boundaries, and local storage polyfill isolation rules are documented in [docs/SECURITY.md](docs/SECURITY.md).
