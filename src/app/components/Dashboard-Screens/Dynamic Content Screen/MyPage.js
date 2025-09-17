// app/components/SharePageCard.jsx
"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import QRCode from "react-qr-code";

export default function SharePageCard({ url }) {
  // Default fallback if no URL passed
  const shareUrl = url || "https://www.lolligive.com/demo";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-code");
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = url;
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 shadow-lg rounded-2xl p-6 text-center space-y-6 border border-gray-700 text-gray-100">
      {/* Instructions */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Your Shareable Page</h2>
        <p className="text-sm text-gray-400">
          This page is your unique link on our platform. You can{" "}
          <span className="font-medium text-indigo-400">share it with your network</span>{" "}
          by copying the link or scanning the QR code below.
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center bg-gray-800 p-4 rounded-xl">
        <QRCode id="qr-code" value={shareUrl} size={180} bgColor="#111827" fgColor="#F9FAFB" />
      </div>

      {/* URL with copy */}
      <div className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
        <span className="text-sm text-gray-300 truncate">{shareUrl}</span>
        <button
          onClick={handleCopy}
          className="ml-2 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-gray-300" />
          )}
        </button>
      </div>

      {/* Download QR Button */}
      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
      >
        <Download className="h-5 w-5" />
        Download QR Code
      </button>
    </div>
  );
}
