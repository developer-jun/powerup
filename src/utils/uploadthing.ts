import { generateComponents } from "@uploadthing/react"; 
import type { UploadthingFileRouter } from "@/app/api/uploadthing/core"; 
export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<UploadthingFileRouter>();