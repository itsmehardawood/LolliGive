// app/components/SharePageCard.jsx
"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Download, Share2, Loader2 } from "lucide-react";
import QRCode from "react-qr-code";

export default function SharePageCard() {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrgAlias = async () => {
      try {
        const orgKeyId = localStorage.getItem("org_key_id");

        if (!orgKeyId) {
          setError("Organization key not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch("https://api.lolligive.com/api/companies/show", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            org_key_id: orgKeyId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch organization data");
        }

        const result = await response.json();

        if (result.data && result.data.alias) {
          const url = `https://www.lolligive.com/org/${result.data.alias}`;
          setShareUrl(url);
        } else {
          throw new Error("Organization alias not found in response");
        }
      } catch (err) {
        console.error("Error fetching organization data:", err);

        // 🟡 Custom message when content setup isn’t done
        if (
          err.message.includes("Failed to fetch organization data") ||
          err.message.includes("Organization alias not found")
        ) {
          setError(
            "Your content setup isn't done yet. Please complete your content setup to get your QR and link."
          );
        } else {
          setError(err.message || "Failed to load organization data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrgAlias();
  }, []);

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

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-[400px] bg-black flex flex-col items-center justify-center px-2">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-gray-400 text-base">Loading your sharing page...</p>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="h-[500px] bg-black flex flex-col items-center justify-center px-2">
        <div className="max-w-sm w-[300px] mx-auto bg-gray-900 shadow-xl rounded-xl p-4 text-center space-y-2 border border-red-700">
          <div className="text-red-400 text-3xl">⚠️</div>
          <h2 className="text-lg font-bold text-white">Setup Required</h2>
          <p className="text-gray-300 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[500px] bg-black flex flex-col items-center justify-start py-8 px-3">
      {/* Heading */}
      <div className="text-center max-w-md mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Share Your Giving Page
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Easily share your unique <span className="text-indigo-400">Lolligive</span> page with friends, family, and supporters.  
          Use the link below or download the QR code to spread the word.
        </p>
      </div>

      {/* Card */}
      <div className=" max-w-sm w-[300px] mx-auto bg-gray-900 shadow-xl rounded-xl p-4 text-center space-y-4 border border-gray-700 text-gray-100">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Share2 className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Your Shareable Page</h2>
          </div>
          <p className="text-xs text-gray-400">
            Share it with your network by copying the link or scanning the QR code.
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-gray-800 p-2 rounded-xl shadow-inner">
            <QRCode
              id="qr-code"
              value={shareUrl}
              size={120}
              bgColor="#111827"
              fgColor="#F9FAFB"
            />
          </div>
        </div>

        {/* URL + Copy */}
        <div className="flex items-center justify-between bg-gray-800 rounded-lg px-2 py-2 shadow-inner">
          <span className="text-xs text-gray-300 truncate max-w-[70%]">
            {shareUrl}
          </span>
          <button
            onClick={handleCopy}
            className="ml-2 p-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
            aria-label={copied ? "Copied" : "Copy link"}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <Copy className="h-3 w-3 text-gray-300" />
            )}
          </button>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-2 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition text-sm font-semibold"
        >
          <Download className="h-4 w-4" />
          Download QR Code
        </button>
      </div>
    </div>
  );
}
