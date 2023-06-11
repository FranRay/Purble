import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    // Get the user ID from the query
    const { userId } = req.query;

    // Check if the ID is valid
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid ID");
    }

    // Get the user
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Get the user's followers and following
    const followers = await prisma.user.findMany({
      where: {
        followingIds: {
          has: userId,
        },
      },
    });

    const following = await prisma.user.findMany({
      where: {
        id: {
          in: existingUser?.followingIds,
        },
      },
    });

    const followersCount = await prisma.user.count({
      where: {
        followingIds: {
          has: userId,
        },
      },
    });

    const followingCount = existingUser?.followingIds.length;

    // Return the user
    return res
      .status(200)
      .json({
        ...existingUser,
        followersCount,
        followers,
        followingCount,
        following,
      });
  } catch (err) {
    console.log(err);
    return res.status(400).end();
  }
}
