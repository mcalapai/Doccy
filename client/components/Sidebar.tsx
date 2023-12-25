"use client";

import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import IconButton from "./IconButton";
import { User } from "iconsax-react";
import { useEffect, useState } from "react";
import Button from "./Button";
import useChatSession from "@/hooks/useChatSession";
import { getChatHistory, loadSavedChat } from "@/app/services/chatApi";
import { motion, AnimatePresence, easeInOut, easeIn } from "framer-motion";
import useCollections from "@/hooks/useCollections";

const Sidebar = () => {
  const router = useRouter();
  const { user, userDetails } = useUser();
  const { currentCollection, setCurrentCollection } = useCollections();
  const {
    setSessionID,
    sessionID,
    savedChats,
    setSavedChats,
    chatHistory,
    setChatHistory,
  } = useChatSession();

  const supabase = useSupabaseClient();

  // on saved chat click, we want to:
  // 1. download chat pkl file from supabase
  // 2. load into langchain conversation
  // 3. set the current collection to the collection of the saved chat
  // 4. convert conversation to chathistory array
  // 5. send to client

  useEffect(() => {
    if (userDetails?.id) {
      getChatHistory(supabase, userDetails?.id)
        .then(setSavedChats)
        .catch(console.log);
    }
  }, [userDetails, supabase, setSavedChats]);

  useEffect(() => {
    console.log("Session id: ", sessionID);
  }, [sessionID]);

  const handleLoadSavedChats = (
    userID: string,
    file_path: string,
    collection_name: string
  ) => {
    loadSavedChat(userID, file_path, collection_name)
      .then((chats) => {
        setChatHistory(chats.chat_history);
        setCurrentCollection(collection_name);
        setSessionID(chats.id);
      })
      .finally(() => {
        console.log("Current collection: ", currentCollection);
      });
  };

  return (
    <div className="w-[250px] h-full flex flex-col gap-y-6 text-text-primary p-4 bg-background-primary border-r border-main-outline">
      <div className="flex flex-col pt-2">
        <p className="font-bold text-[10rem] font-lustig leading-extra-small">
          {user ? (
            <>
              Hello<br></br>there.
            </>
          ) : (
            <>
              Hello<br></br>there.
            </>
          )}
        </p>
        <p className="font-normal pt-2 font-owners text-lg">
          Welcome to Doccy - upload and chat with your docs.
        </p>
      </div>
      <div className="flex flex-col gap-y-2 font-owners">
        <Button
          text="New Chat"
          className="font-semibold text-xl w-full"
          onClick={() => {
            window.location.reload();
          }}
        />
      </div>
      {userDetails && (
        <div className="flex flex-col font-owners gap-y-[12px]">
          <p className="font-semibold text-xl">Chat History</p>
          <div className="space-y-[10px]">
            {savedChats?.map((chat, index) => {
              return (
                <motion.div
                  className="flex flex-col bg-background-tertiary rounded-full hover:opacity-80 transition-all"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index}
                  transition={{
                    ease: easeInOut,
                    duration: 0.25,
                    delay: index / 10,
                  }}
                >
                  {
                    <button
                      className="p-[10px] pl-[20px] w-full overflow-hidden whitespace-nowrap text-ellipsis"
                      onClick={() => {
                        handleLoadSavedChats(
                          userDetails?.id,
                          chat.file_path,
                          chat.collection_name
                        );
                      }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.25,
                          delay: index / 10,
                        }}
                      >
                        {chat.title}
                      </motion.span>
                    </button>
                  }
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {user && (
        <div className="absolute bottom-0 left-0 m-4">
          <IconButton
            icon={<User size={20} className="text-background-primary" />}
            onClick={() => router.push("/account")}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
