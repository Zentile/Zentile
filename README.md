# 🏠 ZenGrid with Self-Hosted Convex

A highly optimized, containerized grid-based homepage built with Nuxt 3 and self-hosted Convex backend. This project demonstrates modern DevOps practices with GitHub Actions, multi-stage Docker builds, and automated deployments.

## ✨ Features

- 🏠 **Beautiful grid-based homepage** with responsive design
- 🔧 **Self-hosted Convex backend** for real-time data management
- 🐳 **Optimized Docker setup** with multi-stage builds
- 🚀 **GitHub Actions CI/CD** with automated image builds
- 📦 **Minimal container size** (~50MB final image)
- 🔒 **Security scanning** with Trivy vulnerability detection
- ⚡ **High performance** with resource limits and health checks
- 🎨 **Modern UI** with CSS Grid and clean styling

## 🚀 Quick Start

### Option 1: Production Deployment (Recommended)

```bash
# Clone and setup
git clone <your-repo-url>
cd zengrid

# Deploy with pre-built image from GHCR
./deploy.sh

# Or specify a tag
./deploy.sh v1.0.0
```

### Option 2: Local Development

```bash
# Clone and setup
git clone <your-repo-url>
cd zengrid

# Run automated setup
./setup.sh

# Or manual setup
npm install
docker compose up -d
docker compose exec convex-backend ./generate_admin_key.sh
# Add admin key to .env.local
npx convex dev
```

## 🌐 Service Access

- **🏠 ZenGrid**: http://localhost:3000
- **🔧 Convex Backend**: http://localhost:3210
- **📊 Convex Dashboard**: http://localhost:6791

## 📦 Container Optimization

### Image Sizes (Approximate)

- **Base Node.js**: ~120MB
- **ZenGrid**: ~50MB (optimized!)
- **Convex Backend**: ~100MB
- **Total Runtime**: ~250MB

### Optimization Techniques Used

- ✅ Multi-stage Docker builds
- ✅ Alpine Linux base images
- ✅ Dependency layer caching
- ✅ Build artifact optimization
- ✅ Resource limits and constraints
- ✅ Health checks and restart policies
- ✅ Network optimization

## 🛠 Development Workflows

### Container Management

```bash
# Development with hot reload
npm run docker:dev

# Production build
npm run docker:prod

# With dashboard enabled
npm run docker:prod-with-dashboard

# Clean up everything
npm run docker:clean
```

### GitHub Actions

The project includes automated workflows:

- **🔧 CI Pipeline**: Tests, builds, and security scans
- **📦 Container Build**: Multi-arch images pushed to GHCR
- **🔒 Security Scanning**: Vulnerability detection with Trivy

Images are automatically built and pushed to `ghcr.io/<username>/zengrid:latest`

### Configuration Files

```
.
├── docker-compose.yml          # Development setup
├── docker-compose.prod.yml     # Production optimized
├── docker-compose.dev.yml      # Development overrides
├── Dockerfile                  # Multi-stage optimized build
├── .dockerignore              # Minimized build context
└── .github/workflows/         # CI/CD automation
    ├── docker-build.yml       # Container builds
    └── ci.yml                 # Testing & security
```

## 🗂 Project Structure

```
zengrid/
├── 🐳 Docker Configuration
│   ├── Dockerfile             # Multi-stage build
│   ├── docker-compose.yml     # Development
│   ├── docker-compose.prod.yml # Production
│   └── .dockerignore          # Build optimization
├── 🔧 Convex Backend
│   ├── convex/schema.ts       # Database schema
│   ├── convex/gridItems.ts    # Queries
│   └── convex/mutations.ts    # Data mutations
├── 🎨 Nuxt Application
│   ├── app.vue               # Main component
│   ├── assets/css/           # Styling
│   ├── plugins/convex.client.ts # Client setup
│   └── nuxt.config.ts        # Optimized config
├── 🚀 CI/CD & Scripts
│   ├── .github/workflows/    # GitHub Actions
│   ├── setup.sh             # Development setup
│   └── deploy.sh            # Production deployment
└── 📄 Configuration
    ├── .env                 # Environment variables
    ├── .env.local.example   # Local template
    └── package.json         # NPM scripts
```

## ⚙️ Configuration

### Environment Variables

#### Production (.env)

```bash
# Core services
CONVEX_PORT=3210
CONVEX_DASHBOARD_PORT=6791
NUXT_PORT=3000

# Optimization
DISABLE_BEACON=true
REDACT_LOGS_TO_CLIENT=true
RUST_LOG=info

# Container image
ZENGRID_IMAGE=ghcr.io/username/zengrid:latest
```

#### Local Development (.env.local)

```bash
CONVEX_SELF_HOSTED_URL=http://127.0.0.1:3210
CONVEX_SELF_HOSTED_ADMIN_KEY=<generated-key>
```

### Database Options

**SQLite (Default)**: Zero configuration, perfect for development and small deployments

**PostgreSQL**: For production workloads

```bash
POSTGRES_URL=postgresql://user:pass@host:5432
```

**MySQL**: Alternative production option

```bash
MYSQL_URL=mysql://user:pass@host:3306
```

## 🚀 Production Deployment

### Prerequisites

- Docker & Docker Compose
- GitHub Container Registry access (for images)
- 1GB RAM minimum, 2GB recommended

### Deployment Steps

1. **Pull and Deploy**:

   ```bash
   ./deploy.sh latest
   ```

2. **Configure Domain** (Optional):

   ```bash
   # Update .env.prod
   CONVEX_CLOUD_ORIGIN=https://api.yourdomain.com
   CONVEX_SITE_ORIGIN=https://yourdomain.com
   ```

3. **Set up Reverse Proxy** (nginx/Cloudflare):
   - `yourdomain.com` → `localhost:3000`
   - `api.yourdomain.com` → `localhost:3210`
   - `dashboard.yourdomain.com` → `localhost:6791`

### Resource Requirements

| Service          | CPU     | Memory  | Storage  |
| ---------------- | ------- | ------- | -------- |
| ZenGrid          | 0.5     | 256MB   | -        |
| Convex Backend   | 1.0     | 512MB   | 1GB+     |
| Convex Dashboard | 0.5     | 256MB   | -        |
| **Total**        | **2.0** | **1GB** | **1GB+** |

## 🔧 Maintenance

### Monitoring

```bash
# View all logs
docker compose logs -f

# Check resource usage
docker stats

# Health checks
curl http://localhost:3210/version
curl http://localhost:3000
```

### Backup & Restore

```bash
# Export data
npx convex export --path backup-$(date +%Y%m%d).json

# Import data
npx convex import --replace-all backup.json
```

### Updates

```bash
# Pull latest images
docker compose pull

# Restart services
docker compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [📚 Convex Documentation](https://docs.convex.dev/)
- [🏠 Self-Hosted Convex Guide](https://github.com/get-convex/convex-backend/blob/main/self-hosted/README.md)
- [⚡ Nuxt 3 Documentation](https://nuxt.com/)
- [🐳 Docker Compose Reference](https://docs.docker.com/compose/)
- [🚀 GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Built with ❤️ using modern DevOps practices**

