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
WORKDIR /app

# Set environment variables for production compliance
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV APP_ENV=production
ENV PORT=8000
ENV HOST=0.0.0.0

# Install system dependencies if any (none needed, but good practice)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend application source
COPY backend/ ./backend/

# Copy built frontend assets to correct path relative to backend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose production port
EXPOSE 8000

# Start Uvicorn running on host 0.0.0.0 and port $PORT
CMD ["sh", "-c", "uvicorn backend.app:app --host 0.0.0.0 --port ${PORT}"]
