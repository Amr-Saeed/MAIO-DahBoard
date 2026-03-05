# Admin Dashboard - Docker Guide

## Building and Running with Docker

### Quick Start

#### Using docker-compose (Recommended)

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

#### Using Docker directly

```bash
# Build the image
docker build -t admin-dashboard .

# Run the container
docker run -p 3000:3000 --name admin-dashboard admin-dashboard

# Stop the container
docker stop admin-dashboard
```

### Environment Variables

Create a `.env.local` file or set environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-api-url
NEXT_PUBLIC_BASE_URL=https://your-api-url
```

### Accessing the Application

Once running, access the dashboard at: http://localhost:3000

### Docker Commands Reference

```bash
# Build
docker build -t admin-dashboard .

# Run with environment variables
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-api-url \
  -e NEXT_PUBLIC_BASE_URL=https://your-api-url \
  admin-dashboard

# View running containers
docker ps

# View logs
docker logs admin-dashboard

# Stop container
docker stop admin-dashboard

# Remove container
docker rm admin-dashboard

# Remove image
docker rmi admin-dashboard
```

### Production Deployment

For production deployment, make sure to:

1. Set proper environment variables
2. Use HTTPS
3. Configure proper CORS settings on your API
4. Use a reverse proxy (nginx/apache) if needed
5. Set up SSL certificates

### Troubleshooting

If the build fails:

1. Ensure Docker is installed and running
2. Check that port 3000 is not already in use
3. Verify environment variables are set correctly
4. Check Docker logs for errors: `docker logs admin-dashboard`
