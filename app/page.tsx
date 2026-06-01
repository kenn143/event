"use client";

import { useState } from "react";

type MediaItem = {
  file: File;
  type: "image" | "video";
};

export default function WeddingApp() {
  const bride = "Gladys";
  const groom = "Kenneth";

  const [tab, setTab] = useState<"home" | "upload" | "gallery" | "done">(
    "home"
  );

  const [galleryTab, setGalleryTab] = useState<"images" | "videos">("images");

  const [files, setFiles] = useState<MediaItem[]>([]);
  const [progress, setProgress] = useState(0);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles: MediaItem[] = Array.from(e.target.files).map((file) => ({
      file,
      type: file.type.startsWith("video") ? "video" : "image",
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const uploadMock = async () => {
    setTab("upload");
    setProgress(0);

    for (let i = 1; i <= 100; i++) {
      await new Promise((r) => setTimeout(r, 10));
      setProgress(i);
    }

    setTab("done");
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
  src="Images/wedding.jpg"
  className="rounded-3xl h-100 w-full object-cover mt-6 shadow-lg"
/>

            <button
              onClick={() => setTab("upload")}
              className="mt-6 w-full bg-pink-400 text-white py-3 rounded-full font-semibold"
            >
              Upload Photos & Videos ✨
            </button>

            {/* ✅ RETAINED EXACT FEATURE */}
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

            <label className="mt-5 border-2 border-dashed border-pink-300 rounded-2xl p-6 flex flex-col items-center text-center bg-pink-50">
              <div className="text-3xl">📤</div>
              <p className="text-sm mt-2">Tap to upload files</p>

              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFiles}
              />
            </label>

            <div className="text-xs text-gray-500 mt-3 text-center">
              Selected: {files.length} files
            </div>

            <input
              placeholder="Your Name/Alias"
              className="w-full mt-4 border p-3 rounded-xl text-sm"
            />

            <textarea
              placeholder="Message 💖"
              className="w-full mt-3 border p-3 rounded-xl text-sm"
              rows={3}
            />

            <button
              onClick={uploadMock}
              className="w-full mt-5 bg-pink-400 text-white py-3 rounded-full"
            >
              Upload Now
            </button>
            <button
              onClick={() => setTab("home")}
              className="w-full mt-4 border border-gray-300 text-gray-600 py-3 rounded-full"
            >
              ← Back to Home
            </button>

            {progress > 0 && progress < 100 && (
              <div className="mt-6 text-center">
                <div className="text-4xl font-bold text-pink-500">
                  {progress}%
                </div>
                <p className="text-sm text-gray-500">
                  Uploading memories...
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= GALLERY (IMPROVED BUT SAME ENTRY) ================= */}
        {tab === "gallery" && (
          <div className="p-5 pb-10">

            <h2 className="text-center text-xl font-bold text-pink-500">
              Wedding Gallery 💖
            </h2>

            {/* HORIZONTAL TABS */}
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

            {/* IMAGES */}
            {galleryTab === "images" && (
              <div className="grid grid-cols-2 gap-2">
                {files.filter(f => f.type === "image").length === 0 ? (
                  <p className="text-xs text-gray-400 col-span-2 text-center">
                    No images yet 📭
                  </p>
                ) : (
                  files
                    .filter(f => f.type === "image")
                    .map((f, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(f.file)}
                        className="h-36 w-full object-cover rounded-2xl shadow"
                      />
                    ))
                )}
              </div>
            )}

            {/* VIDEOS */}
            {galleryTab === "videos" && (
              <div className="space-y-3">
                {files.filter(f => f.type === "video").length === 0 ? (
                  <p className="text-xs text-gray-400 text-center">
                    No videos yet 🎥
                  </p>
                ) : (
                  files
                    .filter(f => f.type === "video")
                    .map((f, i) => (
                      <video
                        key={i}
                        controls
                        className="w-full rounded-2xl shadow"
                        src={URL.createObjectURL(f.file)}
                      />
                    ))
                )}
              </div>
            )}

            <button
              onClick={() => setTab("home")}
              className="w-full mt-6 border py-2 rounded-full"
            >
              Back Home
            </button>
          </div>
        )}

        {/* ================= DONE ================= */}
        {tab === "done" && (
          <div className="p-6 text-center">
            <div className="text-5xl">💖</div>

            <h2 className="text-xl font-bold mt-3 text-pink-500">
              Thank You!
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Your memories are now saved ✨
            </p>

            <button
              onClick={() => setTab("home")}
              className="mt-6 bg-pink-400 text-white px-6 py-2 rounded-full"
            >
              Upload More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}