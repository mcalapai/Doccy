"use client";

import { Paperclip, Send } from "iconsax-react";
import IconButton from "./IconButton";
import QueryInput from "./QueryInput";
import { useState, useEffect } from "react";
import CollectionDropdown from "./CollectionDropdown";
import useCollections from "@/hooks/useCollections";
import DocUpload from "./DocUpload";
import useChatSession from "@/hooks/useChatSession";
import uuid from "react-uuid";
import { useUser } from "@/hooks/useUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./components.css";
import ChatBoxGuest from "./ChatBoxGuest";
import ChatBoxUser from "./ChatBoxUser";

const ChatBoxHost = () => {
  const { userDetails } = useUser();

  return <>{userDetails?.id ? <ChatBoxUser /> : <ChatBoxGuest />}</>;
};

export default ChatBoxHost;
