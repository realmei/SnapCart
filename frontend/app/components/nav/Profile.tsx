import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { useApp } from "~/state/useApp";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileName } from "./ProfileName";

export function Profile({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { userEmail } = useApp()!;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your account details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Avatar Section */}
          <div>
            <Label className="block mb-3">Profile Picture</Label>
            <ProfileAvatar />
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="block mb-2">Name</Label>
            <ProfileName />
          </div>

          {/* Email */}
          <div>
            <Label className="block mb-2">Email</Label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <span className="text-gray-900">{userEmail}</span>
            </div>
            <p className="text-gray-500 mt-2">
              Your email address is used for login and notifications
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}