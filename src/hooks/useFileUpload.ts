import { useAction } from "convex/react";
import { api } from "convex/_generated/api";

export function useFileUpload() {
  const getCloudinarySignature = useAction(
    api.cloudinary.getCloudinarySignature,
  );

  return async (file: File) => {
    const data = await getCloudinarySignature({
      folder: "profiles",
    });

    if (!data || !file) {
      throw new Error("Something went wrong");
    }

    const { apiKey, timestamp, signature, tags, cloudname } = data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", "profiles");
    formData.append("tags", tags.join(","));

    const url = "https://api.cloudinary.com/v1_1/" + cloudname + "/auto/upload";

    const uploadRes = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const { secure_url } = (await uploadRes.json()) as { secure_url: string };

    return secure_url;
  };
}
