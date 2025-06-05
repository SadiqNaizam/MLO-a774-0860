import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"; // Assuming InputOTP is a shadcn component
import { Loader2 } from 'lucide-react';

// TSB Brand Colors
const TSB_PRIMARY_COLOR = '#00A8E1';
const TSB_TEXT_COLOR = '#131B33';

interface SecurityChallengeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onVerify: (otp: string) => Promise<boolean>; // Returns true on success, false on failure
  title?: string;
  description?: string;
  actionButtonText?: string;
}

const SecurityChallengeModal: React.FC<SecurityChallengeModalProps> = ({
  isOpen,
  onOpenChange,
  onVerify,
  title = "Security Verification",
  description = "For your security, please enter the One-Time Password (OTP) sent to your registered device.",
  actionButtonText = "Verify OTP",
}) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("Rendering SecurityChallengeModal, isOpen:", isOpen);

  const handleVerifyClick = async () => {
    if (otp.length < 6) { // Assuming OTP is 6 digits
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const success = await onVerify(otp);
      if (success) {
        console.log("OTP Verification successful");
        onOpenChange(false); // Close modal on success
        setOtp(''); // Clear OTP
      } else {
        setError("Invalid OTP. Please try again or request a new one.");
        console.warn("OTP Verification failed");
      }
    } catch (e) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error during OTP verification:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
        // Reset state when modal is closed externally
        setOtp('');
        setError(null);
        setIsLoading(false);
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle style={{ color: TSB_TEXT_COLOR }}>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <InputOTP maxLength={6} value={otp} onChange={(value) => { setOtp(value); setError(null); }}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            onClick={handleVerifyClick}
            disabled={isLoading || otp.length < 6}
            className="w-full sm:w-auto bg-[--tsb-primary] hover:bg-[--tsb-primary]/90 text-white"
            style={
              {
                '--tsb-primary': TSB_PRIMARY_COLOR,
              } as React.CSSProperties
            }
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {actionButtonText}
          </Button>
        </DialogFooter>
         {/* Placeholder for "Resend OTP" or "Use another method" */}
        <div className="text-center mt-2">
            <Button variant="link" size="sm" className="text-xs text-[--tsb-primary]" style={
              {
                '--tsb-primary': TSB_PRIMARY_COLOR,
              } as React.CSSProperties
            }>
                Having trouble? Resend OTP
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SecurityChallengeModal;