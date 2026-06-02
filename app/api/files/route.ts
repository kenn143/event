

// app/api/files/route.ts
import { UTApi } from "uploadthing/server";
 
const utapi = new UTApi();
 
export async function GET() {
  try {
    const response = await utapi.listFiles();
    const files = (response.files ?? []).map((file) => ({
      url: `https://utfs.io/f/${file.key}`,
      name: file.name,
      type: file.name.match(/\.(mp4|mov|avi|webm|mkv)$/i) ? "video" : "image",
    }));
    return Response.json({ files });
  } catch (error) {
    console.error("UT list error:", error);
    return Response.json({ files: [] }, { status: 500 });
  }
}
 