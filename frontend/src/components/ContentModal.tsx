import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { Button } from "./ui/Button";

interface Note {
  id: number;
  title: string;
  content: string;
}

interface ContentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  type: "Add Content" | "Update Content";
  noteId?: number;
}

export function ContentModal({
  open,
  onClose,
  onSuccess,
  type,
  noteId,
}: ContentModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && type === "Update Content" && noteId) {
      const fetchNote = async () => {
        try {
          const token = localStorage.getItem("token") || "";
          const response = await axios.get<Note>(
            `${BACKEND_URL}/api/v1/notes/${noteId}`,
            {
              headers: {
                token: token,
              },
            },
          );
          setTitle(response.data.title);
          setContent(response.data.content);
        } catch (e) {
          console.error("Error fetching note:", e);
          if (axios.isAxiosError(e)) {
            alert(e.response?.data?.message || "Failed to fetch note");
          }
        }
      };
      fetchNote();
    } else if (type === "Add Content") {
      setTitle("");
      setContent("");
    }
  }, [open, type, noteId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token") || "";

      if (type === "Add Content") {
        await axios.post(
          `${BACKEND_URL}/api/v1/notes`,
          { title, content },
          {
            headers: {
              token: token,
              "Content-Type": "application/json",
            },
          },
        );
      } else if (type === "Update Content" && noteId) {
        await axios.put(
          `${BACKEND_URL}/api/v1/updatenote/${noteId}`,
          { title, content },
          {
            headers: {
              token: token,
              "Content-Type": "application/json",
            },
          },
        );
      }

      setTitle("");
      setContent("");

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        alert(
          e.response?.data?.message ||
            e.response?.data?.error ||
            "Operation failed",
        );
      } else {
        console.error("Unexpected error:", e);
        alert("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="w-screen h-screen fixed z-50 flex justify-center items-center inset-0 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white border rounded-lg shadow-xl py-6 px-6 w-full max-w-md mx-4 relative animate-in fade-in duration-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">{type}</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              placeholder="Enter note content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              type="submit"
              text={type === "Add Content" ? "Add Note" : "Update Note"}
              loading={isLoading}
              size="md"
            />
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
