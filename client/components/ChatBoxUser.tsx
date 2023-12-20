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
    loadingResponse,
    setLoadingResponse,
    chatHistory,
    setChatHistory,
  } = useChatSession();

  // collections
  const [loading, setLoading] = useState(false);
  const [isNewChat, setIsNewChat] = useState<boolean>(true);

  // query
  const [inputText, setInputText] = useState("");

  // file upload
  //const [isUploadedFiles, setIsUploadedFiles] = useState<boolean>(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [collectionNameInput, setCollectionNameInput] = useState("");

  // user
  const { user, userDetails, accessToken } = useUser();

  useEffect(() => {
    if (documents.length > 0 && collectionNameInput === "") {
      setCollectionNameInput(documents[0].name.slice(0, -4));
    }
  }, [documents]);

  const userPostData = async (
    inputText: string,
    accessToken: string,
    collection: string,
    files?: File[]
  ) => {
    setLoadingResponse(true);

    const formData = new FormData();
    formData.append("query", inputText);
    formData.append("access_token", accessToken);
    if (files) {
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      setCurrentCollection(collection);
    }
    formData.append("collection", collection);

    const endpoint = "http://localhost:5000/api/user/query";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
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
    setLoadingResponse(false);
  };

  const saveChat = async (userId: string, sessionId: string) => {
    setLoadingResponse(true);

    const formData = new FormData();
    formData.append("chat_title", "UserChatTest");
    formData.append("user_id", userId);
    formData.append("file_id", sessionId);

    const endpoint = "http://localhost:5000/api/user/save-chat";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.status !== "success") {
        throw new Error("Something went wrong");
      } else {
        const response = data;
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (input: string) => {
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
        const newId = uuid();
        setSessionID(newId);
        setIsNewChat(false);
        saveChat(userDetails?.id, newId);
      } else {
        saveChat(userDetails?.id, sessionID);
      }
      setChatHistory((currentChatHistory) => [...currentChatHistory, input]);
      if (documents.length > 0) {
        // uploading new collection
        userPostData(
          input,
          accessToken,
          userDetails?.id + "___" + collectionNameInput,
          documents
        );
      } else {
        // selecting existing collection
        userPostData(input, accessToken, currentCollection);
      }
    }

    setDocuments([]);
  };

  // fetch collection data
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/get-collections`)
      .then((response) => response.json())
      .then((data) => {
        //console.log("Collections", data.collections);
        setCollections(data.collections);
        setLoading(false);
      });
  }, []);

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
