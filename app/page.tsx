"use client";

import { useState, useCallback } from "react";
import { useUploadThing } from "@/lib/uploadthing";

type UploadedMedia = {
  url: string;
  name: string;
  type: "image" | "video";
};

type PendingMedia = {
  file: File;
  type: "image" | "video";
  preview: string;
};

export default function WeddingApp() {
  const bride = "Gladys";
  const groom = "Kenneth";

  const [tab, setTab] = useState<"home" | "upload" | "gallery" | "done">("home");
  const [galleryTab, setGalleryTab] = useState<"images" | "videos">("images");

  // Files selected but not yet uploaded
  const [pendingFiles, setPendingFiles] = useState<PendingMedia[]>([]);

  // Successfully uploaded files (with real URLs from UploadThing)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedMedia[]>([]);

  const [alias, setAlias] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UploadThing hooks — one per route
  const { startUpload: startImageUpload } = useUploadThing("weddingImageUploader", {
    onUploadProgress: (p) => setProgress(Math.round(p)),
    onClientUploadComplete: (res) => {
      if (!res) return;
      const newUploaded: UploadedMedia[] = res.map((r) => ({
        url: r.url,
        name: r.name,
        type: "image",
      }));
      setUploadedFiles((prev) => [...prev, ...newUploaded]);
    },
    onUploadError: (err) => {
      setError(err.message || "Image upload failed.");
      setIsUploading(false);
    },
  });

  const { startUpload: startVideoUpload } = useUploadThing("weddingVideoUploader", {
    onUploadProgress: (p) => setProgress(Math.round(p)),
    onClientUploadComplete: (res) => {
      if (!res) return;
      const newUploaded: UploadedMedia[] = res.map((r) => ({
        url: r.url,
        name: r.name,
        type: "video",
      }));
      setUploadedFiles((prev) => [...prev, ...newUploaded]);
    },
    onUploadError: (err) => {
      setError(err.message || "Video upload failed.");
      setIsUploading(false);
    },
  });

  // Handle file selection — build local previews
  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected: PendingMedia[] = Array.from(e.target.files).map((file) => ({
      file,
      type: file.type.startsWith("video") ? "video" : "image",
      preview: URL.createObjectURL(file),
    }));
    setPendingFiles((prev) => [...prev, ...selected]);
  }, []);

  const removePending = (index: number) => {
    setPendingFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Kick off the real upload
  const handleUpload = async () => {
    if (pendingFiles.length === 0) return;
    setIsUploading(true);
    setError(null);
    setProgress(0);

    const images = pendingFiles.filter((f) => f.type === "image").map((f) => f.file);
    const videos = pendingFiles.filter((f) => f.type === "video").map((f) => f.file);

    try {
      // Upload images and videos in parallel
      await Promise.all([
        images.length > 0 ? startImageUpload(images) : Promise.resolve(),
        videos.length > 0 ? startVideoUpload(videos) : Promise.resolve(),
      ]);

      // Clean up previews
      pendingFiles.forEach((f) => URL.revokeObjectURL(f.preview));
      setPendingFiles([]);
      setAlias("");
      setMessage("");
      setIsUploading(false);
      setTab("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-pink-100 via-white to-rose-100">
      <div className="w-full max-w-md bg-white shadow-2xl min-h-screen relative overflow-hidden">

        {/* ================= HOME ================= */}
        {tab === "home" && (
          <div className="p-6 text-center">
            <div className="text-xs tracking-widest text-pink-500 bg-pink-50 inline-block px-3 py-1 rounded-full">
              💍 WEDDING MEMORIES
            </div>

            <h1 className="text-4xl font-bold mt-5">
              {groom} <span className="text-pink-400">&</span> {bride}
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Share your beautiful moments 💖
            </p>

            <img
              src="Images/wed.jpg"
              className="rounded-3xl h-85 w-full object-cover mt-6 shadow-lg"
              alt="Wedding"
            />

            <button
              onClick={() => setTab("upload")}
              className="mt-6 w-full bg-pink-400 text-white py-3 rounded-full font-semibold"
            >
              Upload Photos & Videos ✨
            </button>

            <button
              onClick={() => setTab("gallery")}
              className="mt-3 w-full border border-pink-300 text-pink-500 py-3 rounded-full"
            >
              View Gallery 📸
            </button>
          </div>
        )}

        {/* ================= UPLOAD ================= */}
        {tab === "upload" && (
          <div className="p-5 pb-24">
            <h2 className="text-center text-pink-500 font-semibold text-lg">
              Upload Memories 💌
            </h2>

            {/* Drop zone */}
            <label className="mt-5 border-2 border-dashed border-pink-300 rounded-2xl p-6 flex flex-col items-center text-center bg-pink-50 cursor-pointer hover:bg-pink-100 transition">
              <div className="text-3xl">📤</div>
              <p className="text-sm mt-2 text-gray-600">Tap to select photos & videos</p>
              <p className="text-xs text-gray-400 mt-1">Images up to 16MB · Videos up to 256MB</p>
              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFiles}
                disabled={isUploading}
              />
            </label>

            {/* Pending previews */}
            {pendingFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {pendingFiles.map((f, i) => (
                  <div key={i} className="relative">
                    {f.type === "image" ? (
                      <img
                        src={f.preview}
                        className="h-24 w-full object-cover rounded-xl shadow"
                        alt={f.file.name}
                      />
                    ) : (
                      <video
                        src={f.preview}
                        className="h-24 w-full object-cover rounded-xl shadow"
                      />
                    )}
                    <button
                      onClick={() => removePending(i)}
                      className="absolute top-1 right-1 bg-white rounded-full text-xs px-1 shadow"
                      disabled={isUploading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="text-xs text-gray-500 mt-3 text-center">
              {pendingFiles.length} file{pendingFiles.length !== 1 ? "s" : ""} selected
            </div>

            <input
              placeholder="Your Name / Alias"
              className="w-full mt-4 border p-3 rounded-xl text-sm"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              disabled={isUploading}
            />

            <textarea
              placeholder="Message 💖"
              className="w-full mt-3 border p-3 rounded-xl text-sm"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isUploading}
            />

            {/* Error */}
            {error && (
              <div className="mt-3 text-red-500 text-xs text-center bg-red-50 p-2 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            {/* Progress bar */}
            {isUploading && (
              <div className="mt-5">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-pink-100 rounded-full h-2">
                  <div
                    className="bg-pink-400 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={pendingFiles.length === 0 || isUploading}
              className="w-full mt-5 bg-pink-400 text-white py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? `Uploading… ${progress}%` : "Upload Now"}
            </button>

            <button
              onClick={() => setTab("home")}
              disabled={isUploading}
              className="w-full mt-4 border border-gray-300 text-gray-600 py-3 rounded-full disabled:opacity-50"
            >
              ← Back to Home
            </button>
          </div>
        )}

        {/* ================= GALLERY ================= */}
        {tab === "gallery" && (
          <div className="p-5 pb-10">
            <h2 className="text-center text-xl font-bold text-pink-500">
              Wedding Gallery 💖
            </h2>

            <div className="flex bg-pink-50 p-1 rounded-full mt-4 mb-5">
              <button
                onClick={() => setGalleryTab("images")}
                className={`flex-1 py-2 text-sm rounded-full transition ${
                  galleryTab === "images"
                    ? "bg-pink-400 text-white shadow"
                    : "text-gray-500"
                }`}
              >
                📸 Images
              </button>
              <button
                onClick={() => setGalleryTab("videos")}
                className={`flex-1 py-2 text-sm rounded-full transition ${
                  galleryTab === "videos"
                    ? "bg-pink-400 text-white shadow"
                    : "text-gray-500"
                }`}
              >
                🎥 Videos
              </button>
            </div>

            {/* Images tab */}
            {galleryTab === "images" && (
              <div className="grid grid-cols-2 gap-2">
                {uploadedFiles.filter((f) => f.type === "image").length === 0 ? (
                  <p className="text-xs text-gray-400 col-span-2 text-center py-8">
                    No images yet 📭
                  </p>
                ) : (
                  uploadedFiles
                    .filter((f) => f.type === "image")
                    .map((f, i) => (
                      <a key={i} href={f.url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={f.url}
                          className="h-36 w-full object-cover rounded-2xl shadow hover:opacity-90 transition"
                          alt={f.name}
                        />
                      </a>
                    ))
                )}
              </div>
            )}

            {/* Videos tab */}
            {galleryTab === "videos" && (
              <div className="space-y-3">
                {uploadedFiles.filter((f) => f.type === "video").length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">
                    No videos yet 🎥
                  </p>
                ) : (
                  uploadedFiles
                    .filter((f) => f.type === "video")
                    .map((f, i) => (
                      <video
                        key={i}
                        controls
                        className="w-full rounded-2xl shadow"
                        src={f.url}
                      />
                    ))
                )}
              </div>
            )}

            <button
              onClick={() => setTab("home")}
              className="w-full mt-6 border py-2 rounded-full text-gray-600"
            >
              Back Home
            </button>
          </div>
        )}

        {/* ================= DONE ================= */}
        {tab === "done" && (
          <div className="p-6 text-center">
            <div className="text-5xl">💖</div>
            <h2 className="text-xl font-bold mt-3 text-pink-500">Thank You!</h2>
            <p className="text-sm text-gray-500 mt-2">
              Your memories are now saved ✨
            </p>
            <button
              onClick={() => setTab("upload")}
              className="mt-6 bg-pink-400 text-white px-6 py-2 rounded-full"
            >
              Upload More
            </button>
            <button
              onClick={() => setTab("gallery")}
              className="mt-3 block w-full border border-pink-300 text-pink-500 py-2 rounded-full"
            >
              View Gallery 📸
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
