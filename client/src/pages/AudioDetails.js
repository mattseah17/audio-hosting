import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import {
  getAudioDetails,
  getAudioStream,
  updateAudioDetails,
} from "../services/api";

function AudioDetails() {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { id } = useParams();
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAudioDetails = async () => {
      try {
        const response = await getAudioDetails(id);
        setAudio(response.data);
        setEditDescription(response.data.description);
        setEditCategory(response.data.category);
      } catch (error) {
        console.error("Error fetching audio details:", error);
        toast.error("Failed to load audio details. Please try again.");
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchAudioDetails();
  }, [id, navigate]);

  const handlePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.src) {
        audioRef.current.play();
      } else {
        const { url, headers } = getAudioStream(id);
        fetch(url, { headers })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
          })
          .then((blob) => {
            const audioUrl = URL.createObjectURL(blob);
            audioRef.current.src = audioUrl;
            audioRef.current.play();
          })
          .catch((error) => {
            console.error("Error fetching audio:", error);
            toast.error(`Failed to play audio: ${error.message}`);
          });
      }
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handleEnded = () => setIsPlaying(false);
      audioElement.addEventListener("ended", handleEnded);
      return () => {
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditDescription(audio.description);
    setEditCategory(audio.category);
  };

  const handleUpdate = async () => {
    if (!editDescription.trim() || !editCategory.trim()) {
      toast.error("Description and Category cannot be empty");
      return;
    }
    try {
      const response = await updateAudioDetails(id, {
        description: editDescription,
        category: editCategory,
      });
      setAudio(response.data);
      setIsEditModalOpen(false);
      toast.success("Audio details updated successfully!");
    } catch (error) {
      console.error("Error updating audio details:", error);
      toast.error("Failed to update audio details. Please try again.");
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = Number(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!audio) return <div>Loading...</div>;

  return (
    <div
      className="min-h-screen bg-cover"
      style={{ backgroundImage: "url('/Meteor.svg')" }}
    >
      <Navbar />
      <div className="container mx-auto mt-10 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">
            {audio.originalName}
          </h1>
          <button
            onClick={handleEditClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Details
          </button>
        </div>
        <p className="mb-2 text-white">
          <strong>Description:</strong> {audio.description}
        </p>
        <p className="mb-4 text-white">
          <strong>Category:</strong> {audio.category}
        </p>
        <div className="bg-white p-4 rounded shadow">
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
          <div className="flex space-x-4">
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className={`px-4 py-2 rounded ${
                isPlaying
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={handleStop}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Stop
            </button>
          </div>
          <div className="mt-4">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Edit Audio Details</h3>
            <div className="mb-4">
              <label htmlFor="description" className="block mb-2">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="block mb-2">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                disabled={!editDescription.trim() || !editCategory.trim()}
              >
                Update
              </button>
              <button
                onClick={handleEditClose}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioDetails;
