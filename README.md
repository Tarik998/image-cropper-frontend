# Image Cropper Frontend

## Quick Start

### Prerequisites
- **Node.js** (v20 or higher)
- **npm** (comes with Node.js)
- **Docker** (optional, for containerized development)

### Installation
```bash
# Clone the repository
git clone https://github.com/Tarik998/image-cropper-frontend.git
cd image-cropper-frontend

# Install dependencies
npm install
```

## Development

### Method 1: Direct Development
```bash
# Start development server
npm start
# or
ng serve

# Application will be available at:
# http://localhost:4200
```

### Method 2: Docker Compose (Full Stack)
```bash
# Start all services (frontend, backend, database)
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:4200
# Backend:  http://localhost:5001
# Database: localhost:5432
```

### Environment Files

**Development (`src/environments/environment.ts`):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001/api'
};
```

**Production (`src/environments/environment.prod.ts`):**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://image-cropper-backend-332772182253.us-central1.run.app/api'
};
```

## Features

- **Image Upload & Cropping** - Drag & drop or click to upload images
- **Live Preview** - Real-time cropping preview
- **Logo Overlay** - Add configurable logo overlays to cropped images
- **Multiple Configurations** - Save and manage different cropping presets
- **Responsive Design** - Works on desktop and mobile devices
- **Download Results** - Download cropped images instantly


## Live Application

**Live URL:** https://image-cropper-frontend-332772182253.us-central1.run.app

### Deployment Details
- **Platform:** Google Cloud Run
- **Region:** us-central1 (Iowa)
- **Backend API:** https://image-cropper-backend-332772182253.us-central1.run.app
- **Database:** Google Cloud SQL (PostgreSQL)
- **Deployment Method:** Automated from GitHub using Google Cloud Build

### How to Access
1. Visit the live URL above
2. Upload an image by clicking "Choose File" or dragging & dropping
3. Adjust cropping area as needed
4. Configure logo overlay (optional)
5. Click "Crop Image" to process
6. Download your cropped result
