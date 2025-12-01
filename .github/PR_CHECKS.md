# Pull Request Checks

This workflow runs automatically on every pull request to ensure code quality and security.

## What Gets Checked

### Backend Checks
1. **Linting (ESLint)**
   - Checks code style and potential errors
   - Run locally: `cd backend && npm run lint`
   - Fix issues: `cd backend && npm run lint:fix`

2. **Security Scan (npm audit)**
   - Scans for known vulnerabilities in dependencies
   - Run locally: `cd backend && npm audit`
   - Fix issues: `cd backend && npm audit fix`

3. **Tests**
   - Runs unit and integration tests
   - Run locally: `cd backend && npm test`

### Frontend Checks
1. **Linting (ESLint)**
   - Checks React code style and potential errors
   - Run locally: `cd frontend && npm run lint`
   - Fix issues: `cd frontend && npm run lint:fix`

2. **Security Scan (npm audit)**
   - Scans for known vulnerabilities in dependencies
   - Run locally: `cd frontend && npm audit`
   - Fix issues: `cd frontend && npm audit fix`

3. **Tests**
   - Runs React component tests
   - Run locally: `cd frontend && npm test`

4. **Build Check**
   - Ensures the app builds successfully
   - Run locally: `cd frontend && npm run build`

### Security Scan (Trivy)
- Scans entire codebase for vulnerabilities
- Checks for CRITICAL and HIGH severity issues
- Scans dependencies, config files, and more

## Running Checks Locally

Before creating a PR, run these commands:

```bash
# Backend
cd backend
npm install
npm run lint
npm audit
npm test

# Frontend
cd frontend
npm install
npm run lint
npm audit
npm test
npm run build
```

## Fixing Common Issues

### Linting Errors
```bash
# Auto-fix most linting issues
npm run lint:fix
```

### Security Vulnerabilities
```bash
# Try automatic fix
npm audit fix

# For breaking changes
npm audit fix --force
```

### Test Failures
- Review test output
- Fix the code or update tests
- Ensure all tests pass before pushing

## PR Checklist

Before submitting your PR:
- [ ] Code passes linting (`npm run lint`)
- [ ] No security vulnerabilities (`npm audit`)
- [ ] All tests pass (`npm test`)
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Code is properly formatted
- [ ] Commit messages are clear

## Workflow Status

The PR checks will show:
- ✅ Green check - All checks passed
- ⚠️ Yellow warning - Some checks failed but allowed to continue
- ❌ Red X - Critical checks failed

All checks must pass before merging to main/master.
