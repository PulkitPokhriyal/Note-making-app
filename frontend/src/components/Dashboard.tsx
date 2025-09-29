import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { useState, useEffect } from "react";
import { useContent } from "../hooks/useContent";
import { ContentModal } from "./ContentModal";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import axios from "axios";

type User = {
  id: number;
  name: string;
  email: string;
};

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"Add Content" | "Update Content">(
    "Add Content",
  );
  const [selectedNoteId, setSelectedNoteId] = useState<number>();

  const { notes, getNotes } = useContent();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    getNotes();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const handleCreateNote = () => {
    setModalType("Add Content");
    setSelectedNoteId(undefined);
    setModalOpen(true);
  };

  const handleEditNote = (noteId: number) => {
    setModalType("Update Content");
    setSelectedNoteId(noteId);
    setModalOpen(true);
  };

  const handleDeleteNote = async (noteId: number) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await axios.delete(
          `${BACKEND_URL}/api/v1/deletenote/${noteId}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          },
        );
        if (response.status === 200) {
          getNotes();
        } else {
          console.warn("Delete request finished with status:", response.status);
        }
      } catch (error) {
        console.error("Error deleting note:", error);
        alert("Failed to delete note. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-4 items-center">
              <img src="/icon.png" alt="Logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <Button text="Sign Out" size="sm" onClick={handleSignOut} />
          </div>

          <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="font-bold text-3xl lg:text-4xl text-gray-900">
                  Welcome, {user?.name}!
                </p>
                <p className="text-gray-600 mt-2">Email: {user?.email}</p>
              </div>
              <div className="lg:block">
                <Button
                  text="Create Note"
                  size="md"
                  onClick={handleCreateNote}
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            {notes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-gray-900 font-bold text-2xl mb-2">
                  No Notes Yet
                </h2>
                <p className="text-gray-500 text-lg mb-6">
                  Click the button below to create your first note.
                </p>
                <Button
                  text="Create your first note"
                  size="md"
                  onClick={handleCreateNote}
                />
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes.map(({ title, content, id }) => (
                    <Card
                      key={id}
                      title={title}
                      content={content}
                      onEdit={() => handleEditNote(id)}
                      onDelete={() => handleDeleteNote(id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ContentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={getNotes}
        type={modalType}
        noteId={selectedNoteId}
      />
    </>
  );
};
