import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow a POST or DELETE request
  if (req.method !== "POST" && req.method !== "DELETE") {
    res.status(405).end();
  }
  
  try {
    // Destructure the userId from the body
    const { userId } = req.body;
    // Get the current user
    const { currentUser } = await serverAuth(req, res);

    // Check if the userId is valid
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid ID");
    }

    // Get the user with the userId using Prisma
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("Invalid ID");
    }

    // Create a copy of the existing followingIds array from the user, or initialize it as an empty array
    let updatedFollowingIds = [...(currentUser.followingIds || [])];

    if (req.method === "POST") {
      // Follow, Add the current user's id to the updatedFollowingIds array
      updatedFollowingIds.push(userId);

      // create notification
      try {
        await prisma.notification.create({
          data: {
            body: "followed you!",
            userId,
            actorId: currentUser.id,
            type: "follow",
          },
        });

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            hasNotification: true,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }

    // Unfollow, Remove the current user's id from the updatedFollowingIds array
    if (req.method === "DELETE") {
      updatedFollowingIds = updatedFollowingIds.filter(
        (followingId) => followingId !== userId
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        followingIds: updatedFollowingIds,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).end();
  }
}
