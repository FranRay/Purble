import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";

import prisma from "@/libs/prismadb";

const serverAuth = async (req: NextApiRequest) => {
    const session = await getSession({ req });

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

    return { currentUser}
}

export default serverAuth;