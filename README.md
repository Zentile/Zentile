# 🏠 ZenTile with Self-Hosted Convex

A highly optimized, containerized grid-based homepage built with Nuxt 3 and self-hosted Convex backend. Features **client-side Convex integration** with live updates and real-time reactivity.

## ✨ Features

- 🏠 **Beautiful grid-based homepage** with responsive design
- 🔧 **Self-hosted Convex backend** for real-time data management
- ⚡ **Client-side Convex integration** with native live updates and reactivity
- 🌐 **Real-time updates** - changes appear instantly across all connected clients
- 🛡️ **Auto-generated admin keys** for seamless setup
- 🐳 **Optimized Docker setup** with multi-stage builds
- 🚀 **GitHub Actions CI/CD** with automated image builds
- 📦 **Minimal container size** (~50MB final image)
- 🔒 **Security scanning** with Trivy vulnerability detection
- ⚡ **High performance** with resource limits and health checks
- 🎨 **Modern UI** with CSS Grid and clean styling

## � Architecture

This setup uses client-side Convex integration for optimal performance and live updates:

- **Public Convex Backend**: Accessible from browsers for direct client connections
- **Client-side Operations**: All Convex queries run directly in the browser with real-time subscriptions
- **Live Updates**: Instant UI updates when data changes, no manual refresh needed
- **WebSocket Connections**: Efficient real-time communication between client and Convex

```
[Browser/Client] ←→ WebSocket ←→ [Convex Backend]
       ↓                              ↓
  Live Updates                   Data Storage
```

## 🚀 Quick Start

### Option 1: Production Deployment (Recommended)

```bash
# Clone and setup
git clone <your-repo-url>
cd zentile

# Deploy with pre-built image from GHCR
npm run docker:prod

# Or with dashboard enabled
npm run docker:prod-with-dashboard
```

### Option 2: Local Development

```bash
# Clone and setup
git clone <your-repo-url>
cd zentile

# Install dependencies and start services
npm install
npm run docker:dev

# The admin key will be automatically generated on first run
# You can view it in the logs:
npm run docker:logs

# Start convex development
npm run convex:deploy
```

## 🔑 Admin Key Management

The ZenTile setup automatically generates a Convex admin key for you during the first startup. This key is required for the frontend to communicate with the self-hosted Convex backend.

### How It Works

1. **Automatic Generation**: On first run, an `admin-key-generator` service creates a secure random admin key
2. **Persistent Storage**: The key is stored in a Docker volume and persists across container restarts
3. **Secure Access**: The key is only accessible to the ZenTile container and is read-only

### Manual Admin Key Management

If you need to regenerate or manually set an admin key:

```bash
# View the current admin key
docker compose exec admin-key-generator cat /shared/admin_key

# Regenerate the admin key (stops all services first)
docker compose down
docker volume rm zentile_admin_keys
docker compose up -d

# Set a custom admin key (for production)
echo "your-custom-admin-key" | docker compose exec -T admin-key-generator tee /shared/admin_key
```

### Development with Environment Setup

For local development, create a `.env.local` file:

```bash
# Client-side Convex URL - must be accessible from browser
# For Docker Compose development: http://localhost:3210
# For production: https://convex.yourdomain.com
NUXT_PUBLIC_CONVEX_URL=http://localhost:3210

# Server-side Convex URL for admin operations (optional)
CONVEX_SELF_HOSTED_URL=http://127.0.0.1:3210

# Optional: Override auto-generated admin key
CONVEX_SELF_HOSTED_ADMIN_KEY=your-custom-key
```

**Important**: The `NUXT_PUBLIC_CONVEX_URL` must be accessible from the browser. In development with Docker Compose, this is `http://localhost:3210`. In production, you'll need to expose the Convex backend on a public domain.

## 🌐 Service Access

- **🏠 ZenTile**: http://localhost:3000
- **🔧 Convex Backend**: http://localhost:3210 (accessible from browser for client-side integration)
- **📊 Convex Dashboard**: http://localhost:6791

## 🔗 Client-Side Convex Integration

ZenTile uses client-side Convex integration for optimal performance and real-time updates:

### Architecture Overview

```
[Frontend/Browser] ←→ WebSocket ←→ [Convex Backend]
       ↓                              ↓
  Live Updates                   Data Storage
```

### Features

- **Live Updates**: Changes appear instantly across all connected clients
- **Real-time Subscriptions**: Automatic UI updates when data changes
- **Offline Support**: Queries cache locally and sync when reconnected
- **Optimistic Updates**: UI updates immediately for better user experience

### Usage in Components

```vue
<script setup>
import { api } from "~/convex/_generated/api";

// Real-time query with automatic updates
const {
  data: gridItems,
  isLoading,
  error,
} = useConvexQuery(api.gridItems.listGridItems, {});

// Mutations for data changes
const { mutate: createItem } = useConvexMutation(api.gridItems.createGridItem);

// Create a new item (with live updates)
const addItem = async () => {
  await createItem({
    title: "New Item",
    description: "Description",
    url: "https://example.com",
  });
  // UI automatically updates thanks to Convex reactivity!
};
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <div v-for="item in gridItems" :key="item._id">
      {{ item.title }}
    </div>
  </div>
</template>
```

### Configuration Requirements

**Important**: For client-side Convex to work, the Convex backend must be accessible from browsers. Set the environment variable:

```bash
# This URL must be reachable from the browser
NUXT_PUBLIC_CONVEX_URL=http://localhost:3210  # Development
NUXT_PUBLIC_CONVEX_URL=https://convex.yourdomain.com  # Production
```

## 📦 Container Optimization

### Image Sizes (Approximate)

- **Base Node.js**: ~120MB
- **ZenTile**: ~50MB (optimized!)
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

- **🔧 CI Pipeline**: Tests, builds, and security scans with auto-generated Convex stubs
- **📦 Container Build**: Multi-arch images pushed to GHCR with Convex file generation
- **🔒 Security Scanning**: Vulnerability detection with Trivy (SARIF results uploaded to Security tab)

Images are automatically built and pushed to `ghcr.io/zentile/zentile:latest`

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
zentile/
├── 🐳 Docker Configuration
│   ├── Dockerfile             # Multi-stage build
│   ├── docker-compose.yml     # Development with auto admin key
│   ├── docker-compose.prod.yml # Production with auto admin key
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
├── 🚀 CI/CD & Automation
│   └── .github/workflows/    # GitHub Actions
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
ZenTile_IMAGE=ghcr.io/zentile/zentile:latest
```

#### Local Development (.env.local)

```bash
# Client-side Convex URL - must be accessible from browser
NUXT_PUBLIC_CONVEX_URL=http://localhost:3210

# Server-side Convex URL for admin operations (optional)
CONVEX_SELF_HOSTED_URL=http://127.0.0.1:3210

# Optional: Override auto-generated admin key
# CONVEX_SELF_HOSTED_ADMIN_KEY=custom-admin-key

# Note: Admin key is auto-generated if not specified
# Check logs with: docker compose logs admin-key-generator
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
   npm run docker:prod
   ```

2. **Configure Public Domain** (Production):

   ```bash
   # Update .env
   NUXT_PUBLIC_CONVEX_URL=https://convex.yourdomain.com
   ```

3. **Set up Reverse Proxy** (nginx/Cloudflare):
   - `yourdomain.com` → `localhost:3000` (ZenTile app)
   - `convex.yourdomain.com` → `localhost:3210` (Convex backend - must be public)
   - `dashboard.yourdomain.com` → `localhost:6791` (Dashboard - optional)

### Resource Requirements

| Service          | CPU     | Memory  | Storage  |
| ---------------- | ------- | ------- | -------- |
| ZenTile          | 0.5     | 256MB   | -        |
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

**Built with ❤️ using modern web technologies and real-time data**

