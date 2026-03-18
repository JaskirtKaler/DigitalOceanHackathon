FROM python:3.10-slim

WORKDIR /app

# Install system dependencies required for PyBullet OpenGL features, even in headless mode
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the server scripts and assets
COPY . .

# Expose nothing by default as this is a background worker, but maybe it binds ports if needed.
# It sends requests to the backend.

# Run the simulation server headlessly
CMD ["python", "drone_server.py", "--headless"]
