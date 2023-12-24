"use client";

import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import IconButton from "./IconButton";
import { User } from "iconsax-react";
import CollectionDropdown from "./CollectionDropdown";
import { useEffect, useState } from "react";
import useCollections from "@/hooks/useCollections";
import Button from "./Button";
import useChatSession from "@/hooks/useChatSession";
import { Database } from "@/types_db";

const Sidebar = () => {
  const router = useRouter();
  const { user, userDetails } = useUser();
  const { sessionID, setSessionID, savedChats, setSavedChats } =
    useChatSession();

  const supabase = useSupabaseClient();

  const getChatHistory = async () => {
    let { data: chats, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userDetails?.id);
    if (error) console.log("error", error);
    else setSavedChats(chats || []);
  };

  useEffect(() => {
    getChatHistory();
  }, [sessionID]);

  return (
    <div className="w-[250px] h-full flex flex-col gap-y-6 text-text-primary p-4 bg-background-primary border-r border-main-outline">
      <div className="flex flex-col pt-2">
        <p className="font-bold text-[10rem] font-lustig leading-extra-small">
          {user ? (
            <>
              Hello,<br></br>name!
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
      {user && (
        <div className="flex flex-col font-owners gap-y-[12px]">
          <p className="font-semibold text-xl">Chat History</p>
          <div className="space-y-[10px]">
            {savedChats?.map((chat, index) => {
              return (
                <div className="flex flex-col bg-background-tertiary p-[10px] pl-[20px] rounded-full hover:opacity-80 transition-all cursor-pointer">
                  {chat.title}
                </div>
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
