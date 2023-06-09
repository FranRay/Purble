import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Create a new post
    try {
      // Get the current user
      const { currentUser } = await serverAuth(req, res);
      const { body, imageUrl } = req.body;

      // Check if the body is valid
      const post = await prisma.post.create({
        data: {
          body,
          imageUrl,
          userId: currentUser.id,
        },
      });
      
      return res.status(200).json(post);
    } catch (err) {
      console.log(err);
      return res.status(400).end();
    }
  } else if (req.method === "GET") {
    // Retrieve posts
    try {
      // Get the user ID from the query
      const { userId } = req.query;

      // Get posts
      let posts;
      
      if (userId && typeof userId === "string") {
        // Get posts by user ID - used for profile pages
        posts = await prisma.post.findMany({
          where: {
            userId,
          },
          include: {
            user: true,
            comments: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } 
      // else show all posts - used for the home page
      else {
        posts = await prisma.post.findMany({
          include: {
            user: true,
            comments: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }

      return res.status(200).json(posts);
    } catch (err) {
      console.log(err);
      return res.status(400).end();
    }
  } else if (req.method === "PATCH") {
    // Update a post
    try {
      const { currentUser } = await serverAuth(req, res);
      const { postId, editedBody } = req.body;
  
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
  
      if (!post) {
        return res.status(404).end();
      }
  
      // Check if the current user is the owner of the post
      if (post.userId !== currentUser.id) {
        return res.status(403).end();
      }
  
      // Update the post
      const updatedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          body: editedBody, // Update the 'body' field with the editedBody value
        },
      });
  
      return res.status(200).json(updatedPost);
    } catch (err) {
      console.log(err);
      return res.status(400).end();
    }
  } else if (req.method === "DELETE") {
    // Delete a post
    try {
      const { currentUser } = await serverAuth(req, res);
      const { postId } = req.body;

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          comments: true,
        },
      });

      if (!post) {
        return res.status(404).end();
      }

      // Check if the current user is the owner of the post
      if (post.userId !== currentUser.id) {
        return res.status(403).end();
      }

      // Delete the post and its associated comments in a transaction
      await prisma.$transaction([
        prisma.comment.deleteMany({
          where: {
            postId,
          },
        }),
        prisma.post.delete({
          where: {
            id: postId,
          },
        }),
      ]);

      return res.status(200).end();
    } catch (err) {
      console.log(err);
      return res.status(400).end();
    }
  } else {
    return res.status(405).end();
  }
}
