import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../../config";

type Note = {
  id: number;
  title: string;
  content: string;
};
export function useContent() {
  const [notes, setNotes] = useState<Note[]>([]);
  const getNotes = async () => {
    try {
      const response = await axios.get(BACKEND_URL + "/api/v1/notes", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setNotes(response.data.notes);
    } catch (e) {
      console.error("Caught error:", e);
    }
  };
  return {
    notes,
    getNotes,
  };
}
