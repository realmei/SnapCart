import { useNavigate } from "react-router";
import { Edit, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useApp } from "~/state/useApp";
import { Profile } from "./Profile";
import { useState } from "react";

export const UserMenu = ({}: {}) => {
  const { userName, userEmail, onLogout } = useApp();
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const onClickEditProfile = () => {
    setShowProfile(true);
  };

  const onCloseProfile = () => {
    setShowProfile(false);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      onLogout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={userName} />
              <AvatarFallback className="bg-blue-600 text-white">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p>{userName}</p>
              <p className="text-gray-500">{userEmail}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onClickEditProfile}
            className="cursor-pointer"
          >
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={logout}
            className="text-red-600 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2 text-red-600" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showProfile && (
        <Profile
          isOpen={showProfile}
          onClose={onCloseProfile}
        />
      )}
    </>
  );
};
