"use client";

import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

/**
 * Custom hook for Firebase OTP verification
 * Handles reCAPTCHA initialization, OTP sending, and verification
 */
export function useFirebaseOTP() {
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize reCAPTCHA
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Clear previous verifier if exists
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.warn("Failed to clear previous reCAPTCHA", e);
      }
      window.recaptchaVerifier = null;
    }

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved", response);
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired");
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.clear();
              window.recaptchaVerifier = null;
            }
          },
          "error-callback": (error) => {
            console.error("reCAPTCHA error:", error);
          },
        }
      );

      window.recaptchaVerifier
        .render()
        .then((widgetId) => {
          window.recaptchaWidgetId = widgetId;
        })
        .catch((error) => {
          console.error("reCAPTCHA render error:", error);
        });
    } catch (error) {
      console.error("reCAPTCHA initialization error:", error);
    }

    // Cleanup on unmount
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.warn("Failed to clear reCAPTCHA on unmount", e);
        }
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  /**
   * Send OTP to the provided phone number
   * @param {string} phoneNumber - Full phone number with country code (e.g., "+11234567890")
   * @returns {Promise<boolean>} - Returns true if OTP sent successfully
   */
  const sendOTP = async (phoneNumber) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate phone number format
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error(`Invalid phone number format: ${phoneNumber}`);
      }

      // Ensure reCAPTCHA is ready
      if (!window.recaptchaVerifier) {
        throw new Error("reCAPTCHA verifier not initialized");
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );

      setConfirmationResult(confirmation);
      setSuccess("Verification code sent to your phone.");
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Error sending OTP:", err);

      if (err.code === "auth/invalid-phone-number") {
        setError("Invalid phone number format. Please check your number.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many requests. Please try again later.");
      } else if (err.code === "auth/quota-exceeded") {
        setError("SMS quota exceeded. Please try again later.");
      } else {
        setError(err.message || "Failed to send verification code. Please try again.");
      }

      setLoading(false);
      return false;
    }
  };

  /**
   * Verify the OTP code
   * @param {string} otpCode - The 6-digit OTP code entered by user
   * @returns {Promise<object|null>} - Returns Firebase user object if successful, null otherwise
   */
  const verifyOTP = async (otpCode) => {
    if (!confirmationResult) {
      setError("Verification session expired. Please try again.");
      return null;
    }

    setLoading(true);
    setError("");

    try {
      const result = await confirmationResult.confirm(otpCode);
      const user = result.user;

      setSuccess("Phone verified successfully!");
      setLoading(false);
      return user;
    } catch (err) {
      console.error("OTP verification error:", err);

      if (err.code === "auth/invalid-verification-code") {
        setError("Invalid verification code. Please check and try again.");
      } else if (err.code === "auth/code-expired") {
        setError("Verification code has expired. Please request a new one.");
      } else {
        setError("Verification failed. Please try again.");
      }

      setLoading(false);
      return null;
    }
  };

  /**
   * Reset the OTP state
   */
  const resetOTP = () => {
    setConfirmationResult(null);
    setError("");
    setSuccess("");
  };

  return {
    sendOTP,
    verifyOTP,
    resetOTP,
    loading,
    error,
    success,
    isOTPSent: !!confirmationResult,
  };
}
