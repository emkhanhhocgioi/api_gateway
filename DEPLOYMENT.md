# Deployment Guide for API Gateway

## Environment Configuration

### 1. Setup Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 2. Environment Variables Explanation

#### Cloudinary Configuration
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key  
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

#### Service URLs
- `TRIP_SERVICE_URL`: URL of the Trip Service
  - Development: `http://localhost:3002`
  - Production: `https://your-trip-service-domain.com` or `http://your-server-ip:3002`

#### API Gateway Configuration
- `PORT`: Port for API Gateway (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

### 3. Deployment Examples

#### Local Development
```env
TRIP_SERVICE_URL=http://localhost:3002
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

#### Production with Domain
```env
TRIP_SERVICE_URL=https://api.yourdomain.com
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### Production with IP
```env
TRIP_SERVICE_URL=http://192.168.1.100:3002
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=http://192.168.1.100:3000
```

### 4. Docker Deployment

For Docker, you can pass environment variables:

```bash
docker run -d \
  -p 3001:3001 \
  -e TRIP_SERVICE_URL=http://trip-service:3002 \
  -e NODE_ENV=production \
  -e ALLOWED_ORIGINS=https://yourdomain.com \
  your-api-gateway-image
```

### 5. Security Notes

- Never commit `.env` file to version control
- Use `.env.example` as a template
- In production, use secure methods to manage environment variables
- Consider using secrets management for sensitive data

### 6. Future Service URLs

The following environment variables are prepared for future microservices:

- `USER_SERVICE_URL`
- `PAYMENT_SERVICE_URL` 
- `CONTRACT_SERVICE_URL`

Add these to your `.env` file when you implement additional services.
