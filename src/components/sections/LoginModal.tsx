import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PhoneAuthFlow } from "@/components/onboarding/PhoneAuthFlow";
import { X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (isNewUser?: boolean) => void;
}

export default function LoginModal({ isOpen, onClose, onComplete }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 border-0 bg-white rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>
        <PhoneAuthFlow 
          isOpen={true} 
          onComplete={onComplete}
          asModal={true}
        />
      </DialogContent>
    </Dialog>
  );
}
