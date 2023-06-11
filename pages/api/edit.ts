import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow PATCH requests
  if (req.method !== "PATCH") {
    return res.status(405).end();
  }

  try {
    // Get the current user
    const { currentUser } = await serverAuth(req);
    // Destructure the body
    const { name, username, bio, profileImage, coverImage } = req.body;

    // Check if the name and username are valid
    if (!name || !username) {
      throw new Error("Missing fields");
    }

    // Update the user with the new data
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        username,
        bio,
        profileImage,
        coverImage,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).end();
  }
}
