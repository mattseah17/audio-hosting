import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import {
  getUserDetails,
  updateUserDetails,
  deleteUserAccount,
} from "../services/api";

function AccountManagement() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetails();
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to load user details. Please try again.");
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUserDetails({ username, email });
      toast.success("Your details are updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("Failed to update details. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUserAccount();
      toast.success("We are sorry to see you go!");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="min-h-screen bg-cover"
      style={{ backgroundImage: "url('/Meteor.svg')" }}
    >
      <Navbar />
      <div className="container mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Account Management
        </h1>
        <form onSubmit={handleUpdate} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-white">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete my account
            </button>
          </div>
        </form>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
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

export default AccountManagement;
