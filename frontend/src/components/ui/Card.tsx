import { useState } from "react";
import { EditIcon } from "../../icons/EditIcon";
import { DeleteIcon } from "../../icons/DeleteIcon";
import { ExpandIcon } from "../../icons/ExpandIcon";

interface Cardprops {
  title: string;
  content: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const Card = (props: Cardprops) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg flex-1 mr-2">{props.title}</h3>
        <div className="flex gap-2 items-center flex-shrink-0">
          <button
            className="hover:text-blue-600 transition-colors"
            onClick={props.onEdit}
          >
            <EditIcon size="md" />
          </button>
          <button
            className="hover:text-red-600 transition-colors"
            onClick={props.onDelete}
          >
            <DeleteIcon size="md" />
          </button>
          <button
            className={`hover:text-blue-600 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ExpandIcon size="md" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-gray-700 break-words">{props.content}</p>
        </div>
      )}
    </div>
  );
};
