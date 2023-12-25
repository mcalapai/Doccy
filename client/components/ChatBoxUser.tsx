"use client";

import { Paperclip, Send } from "iconsax-react";
import IconButton from "./IconButton";
import QueryInput from "./QueryInput";
import { useState, useEffect, use } from "react";
import CollectionDropdown from "./CollectionDropdown";
import useCollections from "@/hooks/useCollections";
import DocUpload from "./DocUpload";
import useChatSession from "@/hooks/useChatSession";
import uuid from "react-uuid";
import { useUser } from "@/hooks/useUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./components.css";
import {
  getChatHistory,
  getCollectionData,
  postUserQuery,
  saveChat,
} from "@/app/services/chatApi";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const ChatBoxUser = () => {
  // chat session
  const {
    currentCollection,
    setCurrentCollection,
    collections,
    setCollections,
  } = useCollections();
  const {
    sessionID,
    setSessionID,
    setLoadingResponse,
    setChatHistory,
    setSavedChats,
  } = useChatSession();

  const supabase = useSupabaseClient();

  // collections
  const [loading, setLoading] = useState(false);
  //const [isNewChat, setIsNewChat] = useState<boolean>(true);

  // query
  const [inputText, setInputText] = useState("");

  // file upload
  const [documents, setDocuments] = useState<File[]>([]);
  const [collectionNameInput, setCollectionNameInput] = useState("");

  // user
  const { user, userDetails, accessToken } = useUser();

  useEffect(() => {
    if (documents.length > 0 && collectionNameInput === "") {
      setCollectionNameInput(documents[0].name.slice(0, -4));
    }
  }, [documents, collectionNameInput]);

  // post data
  const userPostData = async (
    inputText: string,
    accessToken: string,
    collection: string,
    files?: File[]
  ) => {
    setLoadingResponse(true);
    let chatTitle;

    try {
      setCurrentCollection(collection);
      const chatHistory = await postUserQuery(
        inputText,
        accessToken,
        collection,
        files
      );
      setChatHistory((currentChatHistory) => [
        ...currentChatHistory,
        chatHistory.chat_history,
      ]);
      chatTitle = chatHistory.chat_title;
    } catch (error) {
      console.log("Post query failed: ", error);
    } finally {
      setLoadingResponse(false);
      return chatTitle;
    }
  };

  // submit data
  const onSubmit = (input: string) => {
    let newID: string;
    let currentSessionID;
    let postDataPromise;
    let saveChatPromise;
    if (documents.length === 0 && currentCollection === "") {
      toast(
        "Doccy has no context :( please specify a collection or make one!",
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "custom-error-toast",
          hideProgressBar: true,
        }
      );
      return null;
    }
    if (userDetails && accessToken) {
      if (sessionID === null) {
        newID = uuid();
        setSessionID(newID);
      }
      setChatHistory((currentChatHistory) => [...currentChatHistory, input]);
      if (documents.length > 0) {
        // uploading new collection
        postDataPromise = userPostData(
          input,
          accessToken,
          userDetails?.id + "___" + collectionNameInput,
          documents
        );
      } else {
        // selecting existing collection
        postDataPromise = userPostData(input, accessToken, currentCollection);
      }

      postDataPromise?.then((chatTitle) => {
        currentSessionID = sessionID || newID;
        console.log("Saving chat...");
        console.log("Chat title in post data: ", chatTitle);

        saveChat(
          accessToken,
          chatTitle,
          userDetails?.id,
          currentSessionID
        ).then(() => {
          getChatHistory(supabase, userDetails?.id)
            .then(setSavedChats)
            .catch(console.log);
          console.log("Updated history");
        });
      });
    }

    setDocuments([]);
  };

  useEffect(() => {
    console.log("Session: ", sessionID);
  }, [sessionID]);

  // fetch collection data
  useEffect(() => {
    if (userDetails) {
      setLoading(true);
      getCollectionData(userDetails?.id)
        .then(setCollections)
        .catch(console.log)
        .finally(() => setLoading(false));
    }
  }, [setCollections, userDetails]);

  return (
    <div className="rounded-[20px] border border-main-outline bg-background-primary w-full px-[22px] py-[14px]">
      <div className="w-full h-full gap-x-[12px] flex flex-row">
        {!(sessionID === null) ? (
          <IconButton icon={<Paperclip className="text-black" size={20} />} />
        ) : (
          <DocUpload
            documents={documents}
            setDocuments={setDocuments}
            setCollectionNameInput={setCollectionNameInput}
          />
        )}

        <div className="w-full grid grid-cols-8 gap-x-[12px]">
          <div className="col-span-1">
            {documents.length === 0 ? (
              <CollectionDropdown
                collections={collections}
                disabled={!(sessionID === null)}
              />
            ) : (
              <QueryInput
                className="w-[200px]"
                placeholder="Set collection name..."
                text={collectionNameInput}
                setText={setCollectionNameInput}
              />
            )}
          </div>
          <div className="col-span-7">
            <QueryInput
              placeholder="Enter search query..."
              text={inputText}
              setText={setInputText}
              onEnter={() => onSubmit(inputText)}
            />
          </div>
        </div>

        <IconButton
          icon={<Send className="text-black" size={20} />}
          onClick={() => onSubmit(inputText)}
        />
      </div>
    </div>
  );
};

export default ChatBoxUser;
