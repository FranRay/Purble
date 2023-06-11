import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";

import prisma from "@/libs/prismadb";

// perform server-side authentication
const serverAuth = async (req: NextApiRequest) => {
  // get session from request
  const session = await getSession({ req });

  // if the user is not signed in, throw error
  if (!session?.user?.email) {
    throw new Error("Not signed in");
  }

  // find the user in the database using their email
  const currentUser = await prisma?.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  // if the user is not found, throw error
  if (!currentUser) {
    throw new Error("Not signed in");
  }

  // return the current user
  return { currentUser };
};

export default serverAuth;
