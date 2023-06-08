import axios from "axios";
import { useMemo } from "react";
import { formatDistanceToNowStrict } from "date-fns";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";  

import { BsFillSendFill } from "react-icons/bs";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

import useUser from "@/hooks/useUser";
import useMessages from "@/hooks/useMessages";
import useCurrentUser from "@/hooks/useCurrentUser";

import Avatar from "../Avatar";
import Button from "../Button";

interface ChatWindowProps {
  userId: string;
  showConversations: boolean;
  setShowConversations: (value: boolean) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  userId,
  showConversations,
  setShowConversations,
}) => {
  const { data: currentUser } = useCurrentUser();
  const { data: user, isLoading: isLoadingUser } = useUser(userId);
  const { data: messages = [], mutate: mutateMessages } = useMessages(userId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.post(`/api/messages/${userId}`, {
        content: message,
        recipientId: userId,
      });

      toast.success("Message sent");

      setMessage("");
      setIsLoading(false);
      mutateMessages(); // Update the messages after sending a new one

      // Scroll to the latest message after the message is sent
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      toast.error("Error sending message");
      setIsLoading(false);
    }
  }, [message, userId, mutateMessages]);

  return (
    <div
      className={`
        bg-neutral-900 
        rounded-md 
        m-2
        w-full
        flex
        flex-col
        justify-between
        
        `}
    >
      <h2 className="text-white text-xl border-b-[1px] border-neutral-800 p-2 md:p-4">
        {!isLoadingUser && user ? (
          <>
            <div className="flex flex-row gap-2 justify-between items-center">
              <Button
                onClick={() => setShowConversations(!showConversations)}
                label={
                  showConversations ? (
                    <MdOutlineArrowBackIosNew />
                  ) : (
                    <MdOutlineArrowForwardIos />
                  )
                }
                noBorder={true}
                outline
                notRounded={true}
                transform={true}
              />
              {user.name}
              <div>
                <Avatar userId={userId} />
              </div>
            </div>
          </>
        ) : (
          "Chat Window"
        )}
      </h2>
      <div className="px-4 py-[1px] flex-grow overflow-y-auto border-b-[1px] border-neutral-800 scrollbar">
        {messages
          .filter(
            (message: Record<string, any>) => message.content.trim() !== ""
          )
          .map((message: Record<string, any>, index: number) => {
            const isOwnMessage =
              currentUser && message.senderId === currentUser.id;

            return (
              <div
                key={index}
                className={`flex flex-row gap-4 my-4 ${
                  isOwnMessage ? "justify-end" : ""
                }`}
              >
                <div
                  className={`flex flex-col ${
                    isOwnMessage ? "items-end text-right" : ""
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-full ${
                      isOwnMessage
                        ? "bg-neutral-700 text-white"
                        : "bg-neutral-800 text-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {/* <p className="text-xs text-neutral-500"></p> */}
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>
      <div
        className="
              flex 
              flex-row 

              
              "
      >
        <textarea
          disabled={isLoading}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onClick={() =>
            showConversations && setShowConversations(!showConversations)
          }
          className="
            mx-3 md:mx-6
            my-1 md:my-3
            peer
            resize-none
            w-full
            bg-neutral-900
            ring-0
            outline-none
            text-[20px]
            placeholder-neutral-500
            text-white
            scrollbar
          "
          placeholder="Type your message..."
        ></textarea>
        <div
          className="
        px-4 
        flex 
        flex-row 
        justify-center 
        items-center
        border-l-[1px]
        border-neutral-800
        "
        >
          <Button
            onClick={sendMessage}
            disabled={message.trim().length === 0 || isLoading}
            label={<BsFillSendFill />}
            notRounded={false}
            large
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
