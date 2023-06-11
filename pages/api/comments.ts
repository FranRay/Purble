import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    // Get the current user
    const { currentUser } = await serverAuth(req, res);
    // Destructure the body and query
    const { body } = req.body;
    const { postId } = req.query;

    // Check if the body is valid
    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid ID");
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        body,
        userId: currentUser.id,
        postId,
      },
    });

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
            body: "replied to your post!",
            userId: post.userId,
            actorId: currentUser.id,
            type: "comment",
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

    return res.status(200).json(comment);
  } catch (err) {
    console.log(err);
    return res.status(400).end();
  }
}
