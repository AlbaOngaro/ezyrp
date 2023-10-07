import { v2 as cloudinary } from "cloudinary";
import { Surreal } from "surrealdb.js";

import { QueryResolvers, User } from "__generated__/server";
import { surreal } from "server/surreal";

export const getCloudinarySignature: QueryResolvers["getCloudinarySignature"] =
  async (_, args, { accessToken }) => {
    await surreal.authenticate(accessToken as string);
    const user = (await (surreal as Surreal).info()) as User & {
      workspace: string;
    };

    const tags = [user.workspace];

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: args.folder || "nimblerp",
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
  };
