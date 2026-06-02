// lib/uploadthing/core.ts

import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  weddingImageUploader: f({ image: { maxFileSize: "16MB" } })
    .onUploadComplete(async ({ file }) => {
      console.log("Image uploaded:", file.url);

      return {
        url: file.url,
        name: file.name,
        type: "image",
      };
    }),

  weddingVideoUploader: f({ video: { maxFileSize: "256MB" } })
    .onUploadComplete(async ({ file }) => {
      console.log("Video uploaded:", file.url);

      return {
        url: file.url,
        name: file.name,
        type: "video",
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;