# Audio Hosting Web Application

## System Architecture Documentation

## Overview

The Audio Hosting Web Application is built using a modern full-stack architecture, emphasizing scalability, maintainability, and user experience. The system comprises a React-based frontend, an Express.js backend, MongoDB for data persistence, and a local file system for audio storage.

## Components

a. **Frontend (Client-Side)**

- Technology: React.js with Tailwind CSS
- Port: 3000
- Responsibilities:
  - User interface rendering
  - State management
  - API communication with backend
  - Audio playback interface

b. **Backend (Server-Side)**

- Technology: Express.js (Node.js)
- Port: 5002
- Responsibilities:
  - RESTful API endpoints
  - Business logic implementation
  - Authentication and authorization
  - File handling (upload, retrieval)
  - Database operations

c. **Database**

- Technology: MongoDB
- Responsibilities:
  - Storing user information
  - Storing audio metadata
  - Maintaining relationships between users and their audio files

d. **File Storage**

- Technology: Local File System
- Responsibilities:
  - Storing uploaded audio files
  - Note: In a production environment, this would typically be replaced with a cloud storage solution (e.g., AWS S3)

e. **Authentication**

- JSON Web Tokens (JWT) for maintaining user sessions

## Data Flow

- The client sends HTTP requests to the backend API.
- The backend processes these requests, interacting with the database and file system as necessary.
- For audio file operations:
  - Upload: Client sends file to backend, which saves it to the file system and metadata to the database.
  - Retrieval: Backend fetches file from the file system and streams it to the client.
- The backend sends HTTP responses back to the client.
- The client updates its state and UI based on the received data.

## Key Features

- User authentication and authorization
- Audio file upload and management
- Audio streaming and playback
- User profile management

## Security Considerations

- JWT for secure authentication
- CORS configuration to control API access
- Secure password hashing (bcrypt)
- Input validation and sanitization

## Scalability

- The separation of frontend and backend allows for independent scaling.
- MongoDB can be scaled horizontally for increased data loads.
- The file storage system can be easily replaced with a scalable cloud solution.

## Deployment

- The application is containerized using Docker, allowing for consistent deployment across different environments.
- Docker Compose is used to orchestrate the multi-container application, including the frontend, backend, and database services.

## Future Enhancements

- Implement cloud storage for audio files (e.g., AWS S3)
- Add server-side caching (e.g., Redis) for improved performance
- Implement real-time features using WebSockets

## API Definition

Here are the main API endpoints:

1. Authentication

   - POST /api/auth/register - Register a new user
   - POST /api/auth/login - Login a user

2. User Management

   - GET /api/user - Get user details
   - PUT /api/user - Update user details
   - DELETE /api/user - Delete user account

3. Audio Management
   - POST /api/audio/upload - Upload a new audio file
   - GET /api/audio/list - Get list of user's audio files
   - GET /api/audio/:id - Get details of a specific audio file
   - PUT /api/audio/:id - Update audio file details
   - DELETE /api/audio/:id - Delete an audio file
   - GET /api/audio/stream/:id - Stream an audio file

## Instructions to Run the App

1. Prerequisites

   - Docker and Docker Compose installed on your system
   - Git (optional, for cloning the repository)

2. Clone the repository (if using Git):

   ```
   git clone hhttps://github.com/mattseah17/audio-hosting-app.git
   cd audio-hosting-app
   ```

3. If not using Git, ensure all project files are in a directory on your local machine.

4. Build and start the containers:

   ```
   docker-compose up --build
   ```

5. The application should now be running. Access it in your web browser:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5002

6. To stop the application:
   ```
   docker-compose down
   ```

Note: The first build may take several minutes as it needs to download and build all dependencies.

## Default User Credentials

For testing purposes, you can use the following credentials:

- Email: test02@gmail.com
- Password: 12345678

## Building Docker Images

To build the Docker images for this project:

1. Ensure you are in the root directory of the project.

2. Build the server image:
   ```
   docker build -t audio-hosting-server -f Dockerfile.server
   ```
3. Build the client image:
   ```
   docker build -t audio-hosting-client -f Dockerfile.client
   ```

The Dockerfiles for both the client and server are included in the project root directory (Dockerfile.client and Dockerfile.server). Instructions for building the Docker images and running the application are provided in this README.md file.

These commands will create Docker images named `audio-hosting-server` and `audio-hosting-client` respectively.

Note: Building the images separately is not necessary if you're using docker-compose, as it will build the images automatically when you run `docker-compose up --build`.
