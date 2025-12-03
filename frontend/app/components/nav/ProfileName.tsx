import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useApp } from "~/state/useApp";

export const ProfileName = ({}: {}) => {
  const { userName, setUserName } = useApp()!;

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userName);

  const handleSaveName = () => {
    const newName = editedName.trim();
    if (newName) {
      setUserName(newName);
      setIsEditingName(false);
      toast.success("Name updated successfully!");
    } else {
      toast.error("Name cannot be empty");
    }
  };

  const handleCancelEdit = () => {
    setEditedName(userName);
    setIsEditingName(false);
  };
  
  if (isEditingName) {
    return (
      <div className="flex gap-2">
        <Input
          id="name"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          placeholder="Enter your name"
          className="flex-1"
          autoFocus
        />
        <Button
          onClick={handleSaveName}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          onClick={handleCancelEdit}
          size="sm"
          variant="outline"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
      <span className="text-gray-900">{userName}</span>
      <Button
        onClick={() => setIsEditingName(true)}
        size="sm"
        variant="ghost"
      >
        <Edit2 className="w-4 h-4 mr-2" />
        Edit
      </Button>
    </div>
  )
};
