import { useLazyQuery } from "@apollo/client";
import { GET_CLOUDINARY_SIGNATURE } from "../lib/queries/GET_CLOUDINARY_SIGNATURE";

export function useFileUpload() {
  const [getCloudinarySignature] = useLazyQuery(GET_CLOUDINARY_SIGNATURE);

  return async (file: File) => {
    const { data } = await getCloudinarySignature();

    if (!data) {
      throw new Error("Something went wrong");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", data.getCloudinarySignature.apiKey);
    formData.append(
      "timestamp",
      data.getCloudinarySignature.timestamp.toString(),
    );
    formData.append("signature", data.getCloudinarySignature.signature);
    formData.append("folder", "profiles");

    const url =
      "https://api.cloudinary.com/v1_1/" +
      data.getCloudinarySignature.cloudname +
      "/auto/upload";

    const uploadRes = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const { secure_url } = (await uploadRes.json()) as { secure_url: string };

    return secure_url;
  };
}
