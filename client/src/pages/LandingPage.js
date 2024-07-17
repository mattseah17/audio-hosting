import React from 'react';
import Navbar from '../components/Navbar';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto mt-10 p-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Audio Hosting App</h1>
        <p className="text-xl">
          Register or login to start uploading and managing your audio files.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;