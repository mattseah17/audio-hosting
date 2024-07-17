import React, { useState } from "react";
import { toast } from "react-toastify";
import { uploadAudio } from "../services/api";

function UploadAudioModal({ isOpen, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const isFormValid = () => {
    return file && description && category;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const formData = new FormData();
    formData.append("audio", file);
    formData.append("description", description);
    formData.append("category", category);

    try {
      console.log("Uploading file:", file);
      console.log("Form data:", formData);
      const response = await uploadAudio(formData);
      console.log("Upload response:", response);
      toast.success("Audio file uploaded successfully!");
      onUploadSuccess(response.data);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      console.error("Error response:", error.response);
      toast.error(
        `Failed to upload audio file: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">Upload Audio</h3>
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <label htmlFor="file" className="block mb-2">
              File
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={file ? file.name : ""}
                className="w-full p-2 border rounded-l"
                placeholder="Select a file"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-r"
              >
                Browse
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="audio/*"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2">
              Audio Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block mb-2">
              Audio Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-black rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded ${
                isFormValid()
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isFormValid()}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadAudioModal;
