# GitHub Actions CI/CD Setup Guide

## Overview

This repository includes three GitHub Actions workflows:

1. **ci-cd.yml** - Main CI/CD pipeline (test, build, deploy)
2. **pr-check.yml** - Pull request validation
3. **cleanup.yml** - Scheduled cleanup of old images

## Required Secrets

Configure these secrets in your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

### Docker Hub Credentials

1. **DOCKER_USERNAME**
   - Your Docker Hub username
   - Example: `yourusername`

2. **DOCKER_PASSWORD**
   - Docker Hub access token (recommended) or password
   - Create token at: https://hub.docker.com/settings/security
   - Click "New Access Token"
   - Give it a name like "github-actions"
   - Copy the token value

### AWS EKS Configuration (for Kubernetes deployment)

3. **AWS_ACCESS_KEY_ID**
   - Your AWS access key ID
   - Create in AWS Console: IAM → Users → Security credentials → Create access key

4. **AWS_SECRET_ACCESS_KEY**
   - Your AWS secret access key
   - Shown only once when creating the access key

5. **AWS_REGION**
   - Your AWS region where EKS cluster is located
   - Example: `us-east-1`, `us-west-2`, etc.

6. **EKS_CLUSTER_NAME**
   - Your EKS cluster name
   - Example: `todo-app-cluster`

**Note:** The IAM user needs these permissions:
- `eks:DescribeCluster`
- `eks:ListClusters`
- Kubernetes RBAC permissions to update deployments

## Setup Steps

### 1. Docker Hub Setup

```bash
# Login to Docker Hub
docker login

# Create repositories (if not exists)
# Visit: https://hub.docker.com/repository/create
# Create: yourusername/todo-backend
# Create: yourusername/todo-frontend
```

### 2. Update Kubernetes Deployments

Update your K8s deployment files to use Docker Hub images:

**k8s/backend-deployment.yaml:**
```yaml
spec:
  containers:
  - name: backend
    image: yourusername/todo-backend:latest
    imagePullPolicy: Always  # Change from IfNotPresent
```

**k8s/frontend-deployment.yaml:**
```yaml
spec:
  containers:
  - name: frontend
    image: yourusername/todo-frontend:latest
    imagePullPolicy: Always  # Change from IfNotPresent
```

### 3. Configure GitHub Secrets

```bash
# Navigate to your repo on GitHub
# Go to: Settings → Secrets and variables → Actions

# Add the three secrets:
# - DOCKER_USERNAME
# - DOCKER_PASSWORD
# - KUBE_CONFIG
```

### 4. Test the Pipeline

```bash
# Create a test commit
git add .
git commit -m "Setup CI/CD pipeline"
git push origin main

# Check Actions tab on GitHub to see the workflow running
```

## Workflow Triggers

### Main CI/CD Pipeline (ci-cd.yml)
- **Triggers on:**
  - Push to `main`, `master`, or `develop` branches
  - Pull requests to `main` or `master`
- **Jobs:**
  - Test backend and frontend
  - Build and push Docker images (only on push to main/master)
  - Deploy to Kubernetes (only on push to main/master)

### PR Checks (pr-check.yml)
- **Triggers on:**
  - Pull requests to `main`, `master`, or `develop`
- **Jobs:**
  - Lint and test both components
  - Test Docker builds
  - Validate Kubernetes manifests

### Cleanup (cleanup.yml)
- **Triggers on:**
  - Weekly schedule (Sunday 2 AM)
  - Manual trigger via GitHub UI

## Customization

### Change Docker Registry

To use a different registry (e.g., AWS ECR, GCR):

1. Update `.github/workflows/ci-cd.yml`:
   ```yaml
   env:
     DOCKER_REGISTRY: your-registry.com
     BACKEND_IMAGE: your-registry.com/todo-backend
     FRONTEND_IMAGE: your-registry.com/todo-frontend
   ```

2. Update login action:
   ```yaml
   - name: Login to Registry
     uses: docker/login-action@v3
     with:
       registry: your-registry.com
       username: ${{ secrets.REGISTRY_USERNAME }}
       password: ${{ secrets.REGISTRY_PASSWORD }}
   ```

### Skip Deployment

To only build images without deploying:

1. Comment out or remove the `deploy` job in `ci-cd.yml`
2. Or add a condition:
   ```yaml
   deploy:
     if: false  # Disable deployment
   ```

### Add Environment-Specific Deployments

For staging/production environments:

```yaml
deploy-staging:
  name: Deploy to Staging
  if: github.ref == 'refs/heads/develop'
  steps:
    - name: Deploy to staging namespace
      run: |
        kubectl set image deployment/backend-deployment \
          backend=${{ env.BACKEND_IMAGE }}:${{ github.sha }} \
          -n todo-app-staging

deploy-production:
  name: Deploy to Production
  if: github.ref == 'refs/heads/main'
  environment:
    name: production
    url: https://your-app.com
  steps:
    - name: Deploy to production namespace
      run: |
        kubectl set image deployment/backend-deployment \
          backend=${{ env.BACKEND_IMAGE }}:${{ github.sha }} \
          -n todo-app-production
```

## Monitoring

### View Workflow Runs
- Go to **Actions** tab in your GitHub repository
- Click on any workflow run to see details
- View logs for each job

### Check Deployment Status
```bash
# Check pods
kubectl get pods -n todo-app

# Check deployments
kubectl get deployments -n todo-app

# View rollout history
kubectl rollout history deployment/backend-deployment -n todo-app
```

## Troubleshooting

### Build Fails
- Check Node.js version compatibility
- Ensure package-lock.json is committed
- Review error logs in Actions tab

### Docker Push Fails
- Verify DOCKER_USERNAME and DOCKER_PASSWORD secrets
- Check Docker Hub repository exists
- Ensure token has write permissions

### Deployment Fails
- Verify KUBE_CONFIG secret is correct
- Check kubectl can connect: `kubectl get nodes`
- Ensure namespace exists: `kubectl get ns todo-app`
- Verify deployment names match

### Image Pull Errors in K8s
- Ensure images are public or add imagePullSecrets
- Verify image tags are correct
- Check Docker Hub repository permissions

## Best Practices

1. **Use semantic versioning** for releases
2. **Tag releases** to trigger versioned builds
3. **Enable branch protection** for main/master
4. **Require PR reviews** before merging
5. **Run tests locally** before pushing
6. **Monitor resource usage** in Kubernetes
7. **Set up alerts** for failed deployments

## Next Steps

- [ ] Add actual tests to backend and frontend
- [ ] Set up staging environment
- [ ] Configure monitoring (Prometheus/Grafana)
- [ ] Add security scanning (Snyk, Trivy)
- [ ] Implement rollback strategy
- [ ] Add performance testing
- [ ] Configure auto-scaling
