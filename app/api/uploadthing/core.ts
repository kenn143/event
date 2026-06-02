// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  weddingImageUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 20 },
  })
    .middleware(async () => {
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image upload complete:", file.url);
      return { url: file.url, name: file.name, uploadedAt: metadata.uploadedAt };
    }),

  weddingVideoUploader: f({
    video: { maxFileSize: "256MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Video upload complete:", file.url);
      return { url: file.url, name: file.name, uploadedAt: metadata.uploadedAt };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;