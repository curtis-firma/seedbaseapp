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
      <DialogContent className="sm:max-w-md p-0 border-0 bg-white rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto" hideCloseButton>
        <div
          onClick={onClose}
          role="button"
          tabIndex={0}
          className="absolute right-3 top-3 z-50 p-2 rounded-full bg-muted hover:bg-accent transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </div>
        <PhoneAuthFlow 
          isOpen={true} 
          onComplete={onComplete}
          asModal={true}
        />
      </DialogContent>
    </Dialog>
  );
}
