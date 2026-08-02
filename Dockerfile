# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend dependency definitions
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy the rest of the frontend source
COPY frontend/ ./

# Build the production React assets to dist/
RUN npm run build

# Stage 2: Build the FastAPI backend and serve static assets
FROM python:3.11-slim
WORKDIR /app/backend

# Set environment variables for production compliance
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV APP_ENV=production
ENV PORT=8000
ENV HOST=0.0.0.0

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application source
COPY backend/ ./

# Copy built frontend assets to the shared workspace location
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose production port
EXPOSE 8000

# Start Uvicorn from the backend directory to ensure local imports like 'security' work
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT}"]
