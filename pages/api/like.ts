import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // Only allow a POST or DELETE request
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).end();
  }
  
  try {
    // Destructure the postId from the body
    const { postId } = req.body; 

    // Get the current user
    const { currentUser } = await serverAuth(req, res);

    // Check if the postId is valid
    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid ID");
    }

    // Get the post with the postId using Prisma
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    // Check if the post exists, if not throw an error
    if (!post) {
      throw new Error("Invalid ID");
    }

    // Create a copy of the existing likedIds array from the post, or initialize it as an empty array
    let updatedLikedIds = [...(post.likedIds || [])];

    // Like, Add the current user's id to the updatedLikedIds array
    if (req.method === "POST") {
      updatedLikedIds.push(currentUser.id);

      // Find post author and create notification
      try {
        const post = await prisma.post.findUnique({
          where: {
            id: postId,
          },
        });

        if (post?.userId) {
          await prisma.notification.create({
            data: {
              body: "liked your post!",
              userId: post.userId,
              actorId: currentUser.id,
              type: "like",
              postId: postId,
            },
          });

          await prisma.user.update({
            where: {
              id: post.userId,
            },
            data: {
              hasNotification: true,
            },
          });
        }
      } catch (err) {
        console.log(err);
      }
    }

    // Unlike, Remove the current user's id from the updatedLikedIds array
    if (req.method === "DELETE") {
      updatedLikedIds = updatedLikedIds.filter(
        (likedId) => likedId !== currentUser.id
      );
    }

    // Update the post with the updatedLikedIds array
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likedIds: updatedLikedIds,
      },
    });

    return res.status(200).json(updatedPost);
  } catch (err) {
    return res.status(400).end();
  }
}
