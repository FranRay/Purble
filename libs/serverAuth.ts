import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import prisma from "@/libs/prismadb";
import { getServerSession } from "next-auth";

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
    
    const session = await getServerSession(req, res, authOptions);

    if(!session?.user?.email) {
        throw new Error('You must be logged in to do this.');
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        }
    });

    if (!currentUser) {
        throw new Error('You must be logged in to do this.');
    }

    return { currentUser }
}

export default serverAuth;