import { Link, useLocation, useNavigate } from "react-router";
import { ShoppingCart, Upload, ChartNoAxesCombined, Edit, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useApp } from "~/state/useApp";
import { Profile } from "./Profile";
import { useState } from "react";

interface NavigationProps {
}

const navItems = [
  { label: "Dashboard", path: "dashboard", icon: ChartNoAxesCombined },
  { label: "Upload", path: "upload", icon: Upload },
];

export function Navigation({ }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname; // e.g. "/dashboard" or "/upload"
  const { userName } = useApp();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("dashboard")}>
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <span className="text-xl text-gray-900">SnapCart</span>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            { navItems.map((item) => (
              <NavItem key={item.path} item={item} currentPath={currentPath} />
            )) }
          </div>

          {/* User Menu */}
          <div className="flex items-center">
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
              <UserMenuDropdownContent />
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Bottom tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-16">
          { navItems.map((item) => (
            <NavItem key={item.path} item={item} currentPath={currentPath} variant="mobile" />
          )) }
        </div>
      </div>
    </nav>
  );
}

const NavItem = ({
  item,
  currentPath,
  variant = "desktop",
}: {
  item: { label: string; path: string; icon: React.ComponentType<any> };
  currentPath: string;
  variant?: "desktop" | "mobile";
}) => {
  const path = `/${item.path}`;
  const isActive = currentPath.startsWith(path);

  const Icon = item.icon;

  return (
    <Link
      to={path}
      className={`flex flex-col items-center gap-1 px-4 cursor-pointer transition-colors ${
        isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {variant === "mobile" && <Icon className="w-5 h-5" />}
      <span className={variant === "mobile" ? "text-xs" : ""}>{item.label}</span>
    </Link>
  );
};

const UserMenuDropdownContent = () => {
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

      {showProfile && (
        <Profile
          isOpen={showProfile}
          onClose={onCloseProfile}
        />
      )}
    </>
  );
};
