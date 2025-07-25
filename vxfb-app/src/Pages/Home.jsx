import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

export default function HomePage() {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFile = (file) => {
    if (!file) return;
    if (
      ![
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-matroska",
      ].includes(file.type)
    ) {
      alert("Please upload a valid video file (MP4, MOV, AVI, MKV).");
      return;
    }

    setIsUploading(true);
    setVideoFile(file);
    setProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
        }, 200);
      }
    }, 150);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const startEditing = () => {
    if (videoFile && selectedCategory) {
      navigate(`/Editor?id=1&category=${encodeURIComponent(selectedCategory)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center px-4 bg-gradient-to-b from-black via-gray-900 to-gray-800 overflow-visible">
      <style>{`
        .gradient-text {
          background: linear-gradient(90deg, #06b6d4, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
      `}</style>
      <h1 className="text-4xl font-bold mt-8 mb-6 gradient-text">
        Start Your Project
      </h1>

      {/* Upload Box */}
      <div
        className={`relative w-full max-w-2xl h-64 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center transition-all ${
          dragActive ? "bg-gray-800/50 border-pink-500" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska"
          onChange={handleChange}
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer w-full h-full flex flex-col items-center justify-center px-6"
        >
          {isUploading ? (
            <div className="w-full">
              <div className="animate-pulse rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4 mx-auto"></div>
              <p className="font-semibold text-white mb-2">Uploading...</p>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-pink-500 h-3 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : videoFile ? (
            <div className="flex flex-col items-center justify-center text-green-400">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-semibold">Uploaded: {videoFile.name}</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mb-4" />
              <p className="font-semibold text-gray-300">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500 mt-1">
                MP4, MOV, AVI, MKV (MAX. 500MB)
              </p>
            </>
          )}
        </label>
      </div>

      {/* Video Category Section */}
      <h2 className="text-xl font-semibold mt-10 mb-4 text-center gradient-text">
        Video Category
      </h2>
      <div className="grid grid-cols-3 gap-4 w-full max-w-3xl mx-auto">
        {[
          { label: "Dance", icon: "🎵" },
          { label: "Singing", icon: "🎤" },
          { label: "Monologue", icon: "🎧" },
          { label: "Edits", icon: "✨" },
          { label: "Tutorial", icon: "⏱️" },
          { label: "Vlog", icon: "🎥" },
          { label: "Gaming", icon: "💡" },
          { label: "Comedy", icon: "💬" },
          { label: "Other", icon: "📦" },
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(item.label)}
            className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all 
            ${
              selectedCategory === item.label
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Start Editing Button */}
      <button
        onClick={startEditing}
        className={`mt-10 mb-16 px-6 py-3 rounded-xl font-semibold transition-all ${
          !videoFile || !selectedCategory || isUploading
            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
            : "bg-pink-600 text-white hover:bg-pink-700"
        }`}
      >
        Start Editing
      </button>
    </div>
  );
}
