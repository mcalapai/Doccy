"use client";

import { ArrowUp, Paperclip, Send } from "iconsax-react";
import IconButton from "./IconButton";
import QueryInput from "./QueryInput";
import { useStore } from "@/store/store";
import { useState } from "react";

const ChatBox = () => {
  // Global store
  const chatHistory = useStore((state) => state.chatHistory);
  const setChatHistory = useStore((state) => state.setChatHistory);

  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  const postData = async (inputText: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: inputText,
        }),
      });
      const data = await response.json();

      if (data.status !== "success") {
        throw new Error("Something went wrong");
      } else {
        const response = data.chat_history;
        setChatHistory((currentChatHistory) => [
          ...currentChatHistory,
          response,
        ]);
      }
    } catch (error) {
      console.log(error);
      //setErrorMessage(true);
    }
    setLoading(false);
  };

  const onSubmit = (input: string) => {
    // append to user input history
    setChatHistory((currentChatHistory) => [...currentChatHistory, input]);
    postData(input);
  };

  return (
    <div className="rounded-[20px] border border-main-outline bg-background-primary w-full px-[22px] py-[14px]">
      <div className="w-full h-full gap-x-[12px] flex flex-row">
        <IconButton icon={<ArrowUp className="text-black" size={20} />} />
        <IconButton icon={<Paperclip className="text-black" size={20} />} />
        <QueryInput text={inputText} setText={setInputText} />
        <IconButton
          icon={<Send className="text-black" size={20} />}
          onClick={() => onSubmit(inputText)}
        />
      </div>
    </div>
  );
};

export default ChatBox;
