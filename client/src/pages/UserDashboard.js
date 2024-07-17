import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import UploadAudioModal from "../components/UploadAudioModal";
import { getUserAudios, deleteAudio } from "../services/api";

function UserDashboard() {
  const [audios, setAudios] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchAudios = async () => {
    try {
      const response = await getUserAudios();
      console.log("API response:", response.data);
      setAudios(response.data.audios || []);
      setUsername(response.data.username || "");
    } catch (error) {
      console.error("Error fetching audio files:", error);
      toast.error("Failed to load audio files. Please try again.");
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudios();
  }, [navigate]);

  const handleUploadSuccess = () => {
    fetchAudios();
    setIsUploadModalOpen(false);
  };

  const handleDeleteClick = (audio) => {
    setAudioToDelete(audio);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAudio(audioToDelete._id);
      toast.success("Audio file deleted successfully!");
      setIsDeleteModalOpen(false);
      setAudioToDelete(null);
      fetchAudios();
    } catch (error) {
      console.error("Error deleting audio file:", error);
      toast.error("Failed to delete audio file. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover"
      style={{ backgroundImage: "url('/Meteor.svg')" }}
    >
      <Navbar />
      <div className="container mx-auto mt-10 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            Hi, {username}! Here are your music tracks.
          </h1>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Upload Audio
          </button>
        </div>
        {audios.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Uploaded on
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {audios.map((audio) => (
                  <tr key={audio._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <Link
                        to={`/audio/${audio._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {audio.originalName}
                      </Link>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {audio.category}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {new Date(audio.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleDeleteClick(audio)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10">
            You haven't uploaded any audio files yet.
          </p>
        )}
      </div>
      <UploadAudioModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4 text-center">
              Are you sure you want to delete this audio file?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setAudioToDelete(null);
                }}
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

export default UserDashboard;
