# Audio Hosting Web Application

## System Architecture

[Include a diagram or description of your system architecture here. You can use tools like draw.io or Lucidchart to create a diagram, save it as an image, and include it in your project. Then reference it here like this:]

![System Architecture](./system_architecture.png)

Our application follows a client-server architecture:
- Frontend: React.js with Tailwind CSS for styling
- Backend: Express.js server
- Database: MongoDB
- File Storage: Local file system (in a production environment, this would be replaced with a cloud storage solution)

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

3. If not using Git, ensure all project files are in a directory on your local machine.

4. Build and start the containers:
   ```
   