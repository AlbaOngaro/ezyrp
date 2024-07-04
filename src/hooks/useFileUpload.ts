import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { Id } from "convex/_generated/dataModel";

export function useFileUpload() {
  const [getStorageUrl] = useLazyQuery(api.storage.get);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  return async (file: File) => {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });
    const { storageId } = await result.json();

    const storageUrl = await getStorageUrl({
      id: storageId as Id<"_storage">,
    });

    return {
      storageId: storageId as Id<"_storage">,
      storageUrl,
    };
  };
}
