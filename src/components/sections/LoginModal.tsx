import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PhoneAuthFlow } from "@/components/onboarding/PhoneAuthFlow";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (isNewUser?: boolean) => void;
}

export default function LoginModal({ isOpen, onClose, onComplete }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 border-0 bg-white rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <PhoneAuthFlow 
          isOpen={true} 
          onComplete={onComplete}
          asModal={true}
        />
      </DialogContent>
    </Dialog>
  );
}
