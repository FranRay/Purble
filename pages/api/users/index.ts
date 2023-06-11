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
    // Get all users, ordered by newest
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(400).end();
  }
}
