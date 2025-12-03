import { Link, useLocation, useNavigate } from "react-router";
import { ShoppingCart, Upload, ChartNoAxesCombined } from "lucide-react";
import { useApp } from "~/state/useApp";
import { UserMenu } from "./UserMenu";

const navItems = [
  { label: "Dashboard", path: "dashboard", icon: ChartNoAxesCombined },
  { label: "Upload", path: "upload", icon: Upload },
];

export function Navigation({}: {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname; // e.g. "/dashboard" or "/upload"
  
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
            <UserMenu />
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

