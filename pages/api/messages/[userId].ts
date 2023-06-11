import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";
import { Prisma } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // If the request method is POST, create a new message
  if (req.method === "POST") {
    console.log("Request Body:", req.body);

    // Get the content and recipient ID from the request body
    const { content, recipientId } = req.body;
    const { currentUser } = await serverAuth(req, res);

    // create a new message
    const newMessage = await prisma.privateMessage.create({
      data: {
        content,
        senderId: currentUser.id,
        recipientId,
      },
    });

    res.status(201).json(newMessage);
  } 
  // if the request method is GET, retrieve the conversation
  else if (req.method === "GET") {
    // Get the user ID from the query
    const { userId } = req.query;
    const { currentUser } = await serverAuth(req, res);
    
    const validUserId = userId as string;

    // get conversation between the current user and the specified user ID
    const conversation = await prisma.privateMessage.findMany({
      where: {
        OR: [
          { senderId: currentUser.id, recipientId: validUserId },
          { senderId: validUserId, recipientId: currentUser.id },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json(conversation);
  } 
  // if the request method is PUT, create a new conversation
  else if (req.method === "PUT") {
    const { userId } = req.query;
    const { currentUser } = await serverAuth(req, res);
    const validUserId = userId as string;

    // check if a conversation already exists between the current user and the specified user ID
    const conversationExists = await prisma.privateMessage.findFirst({
      where: {
        OR: [
          { senderId: currentUser.id, recipientId: validUserId },
          { senderId: validUserId, recipientId: currentUser.id },
        ],
      },
    });

    // if a conversation does not exist, create a new one
    if (!conversationExists) {
      const emptyConversationData: Prisma.PrivateMessageCreateInput = {
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        recipient: {
          connect: {
            id: validUserId,
          },
        },
        content: "",
      };

      await prisma.privateMessage.create({ data: emptyConversationData });
    }

    res.status(200).json({ message: "Conversation created or exists" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
