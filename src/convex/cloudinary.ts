"use node";
import { v2 as cloudinary } from "cloudinary";

import { v } from "convex/values";
import { action } from "./_generated/server";

export const getCloudinarySignature = action({
  args: {
    folder: v.optional(v.string()),
  },
  handler: async (_, { folder = "nimblerp" }) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const tags: string[] = [];

    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        tags,
      },
      process.env.CLOUDINARY_API_SECRET as string,
    );

    return {
      timestamp,
      signature,
      cloudname: process.env.CLOUDINARY_CLOUD_NAME as string,
      apiKey: process.env.CLOUDINARY_API_KEY as string,
      tags,
    };
  },
});
