import { useState } from "react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

import Header from "@/components/Header";
import Conversations from "@/components/Messages/Conversations";
import ChatWindow from "@/components/Messages/ChatWindow";

// This page is only accessible to logged in users
export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  
  // If the user is not logged in, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // If the user is logged in, return their session as a prop
  return {
    props: {
      session,
    },
  };
}

const Messages = () => {
  const router = useRouter();

  // Get the selected user ID from the query string
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    (router.query.selectedUser as string | null) || null
  );
  
  // Show the conversations list by default
  const [showConversations, setShowConversations] = useState<boolean>(true);
  
  // If a user is selected, show the chat window instead
  // otherwise, show the conversations list and a message
  return (
    <>
      <Header label="Messages" showBackArrow />
      <div className="flex flex-row justify-between relative h-[72vh]">
        <div
          className={`
            transition-all
            duration-300
            ease-in-out
            flex
            ${showConversations ? "w-1/3" : "w-0"}
            `}
        >
          <Conversations
            onUserSelect={setSelectedUserId}
            show={showConversations}
          />
        </div>
        <div
          className={`
            transition-all 
            duration-300 
            ease-in-out
            flex
            w-full
            
          `}
        >
          {selectedUserId ? (
            <ChatWindow
              userId={selectedUserId}
              showConversations={showConversations}
              setShowConversations={setShowConversations}
            />
          ) : (
            <div
              className="
            bg-white
            rounded-xl
            p-4
            flex
            flex-col
            w-full
            justify-center
            items-center
            "
            >
              <h2 className="text-[#475885] text-xl font-semibold">
                Start a conversation!
              </h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;
