import { delay } from "@/lib/utils";

/**
 * Mock OTP auth, shaped like a real client so it can be swapped for:
 *
 *   POST /api/auth/otp      { phone }
 *   POST /api/auth/verify   { phone, code }
 *
 * The UI never decides whether a code is valid — only this module does.
 */
export const DEMO_OTP = "2468";
export const OTP_LENGTH = 4;

export interface OtpRequestResult {
  sent: boolean;
  resendAfterSeconds: number;
  /** Present only in mock mode so the demo remains usable. */
  demoCode?: string;
}

export interface OtpVerifyResult {
  success: boolean;
  error?: string;
}

export const authService = {
  async requestOtp(phone: string): Promise<OtpRequestResult> {
    await delay(700);
    if (!/^[6-9]\d{9}$/.test(phone)) {
      throw new Error("Enter a valid 10-digit Indian mobile number.");
    }
    return {
      sent: true,
      resendAfterSeconds: 30,
      demoCode: DEMO_OTP,
    };
  },

  async verifyOtp(phone: string, code: string): Promise<OtpVerifyResult> {
    await delay(650);
    if (!/^\d{4}$/.test(code)) {
      return { success: false, error: "Enter the 4-digit code." };
    }
    if (code !== DEMO_OTP) {
      return {
        success: false,
        error: "That code doesn't match. Try the demo code below.",
      };
    }
    return { success: true };
  },
};
