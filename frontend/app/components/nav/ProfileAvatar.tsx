import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { useApp } from "~/state/useApp";

export const ProfileAvatar = ({}: {}) => {
  const { userName, userAvatar, setUserAvatar } = useApp()!;
  const [avatarUrl, setAvatarUrl] = useState(userAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        setUserAvatar(result);
        toast.success("Avatar updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl} alt={userName} />
          <AvatarFallback className="bg-blue-600 text-white text-2xl">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <button
          onClick={triggerFileUpload}
          className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors shadow-lg cursor-pointer"
          aria-label="Upload avatar"
        >
          <Camera className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
      </div>
      <div>
        <p className="text-gray-600">
          Click the camera icon to upload a new photo
        </p>
        <p className="text-gray-500">
          JPG, PNG or GIF. Max size 5MB.
        </p>
      </div>
    </div>
  );
}