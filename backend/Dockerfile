# Build stage
FROM golang:alpine AS builder

WORKDIR /app

# Copy mod files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy application source code
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Run stage
FROM alpine:latest

WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /app/main .

# Copy the .env file if it exists, along with any other required directories
COPY .env* ./
# Note: You might need to copy db or other directories if they contain required static assets/migrations.

EXPOSE 8080

CMD ["./main"]
