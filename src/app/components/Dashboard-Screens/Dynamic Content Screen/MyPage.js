// app/components/SharePageCard.jsx
"use client";

import { useState } from "react";
import { Copy, Check, Download, Share2 } from "lucide-react";
import QRCode from "react-qr-code";

export default function SharePageCard({ url }) {
  const shareUrl = url || "https://www.lolligive.com/org/hope";
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-start py-12 px-4">
      {/* Page Heading */}
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Share Your Giving Page
        </h1>
        <p className="mt-3 text-lg text-gray-400">
          Easily share your unique <span className="text-indigo-400">Lolligive</span> page with friends, family, and supporters.  
          Use the link below or download the QR code to spread the word.
        </p>
      </div>

      {/* Card */}
      <div className="max-w-md w-full mx-auto bg-gray-900 shadow-xl rounded-2xl p-8 text-center space-y-6 border border-gray-700 text-gray-100">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Share2 className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Your Shareable Page</h2>
          </div>
          <p className="text-sm text-gray-400">
            Share it with your network by copying the link or scanning the QR code.
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-gray-800 p-4 rounded-xl shadow-inner">
            <QRCode
              id="qr-code"
              value={shareUrl}
              size={200}
              bgColor="#111827"
              fgColor="#F9FAFB"
            />
          </div>
        </div>

        {/* URL & Copy Button */}
        <div className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3 shadow-inner">
          <span className="text-sm text-gray-300 truncate max-w-[70%]">
            {shareUrl}
          </span>
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
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition font-semibold"
        >
          <Download className="h-5 w-5" />
          Download QR Code
        </button>
      </div>
    </div>
  );
}
