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

const ChatBoxGuest = () => {
  // chat session
  const {
    currentCollection,
    setCurrentCollection,
    collections,
    setCollections,
  } = useCollections();
  const { sessionID, setSessionID, setLoadingResponse, setChatHistory } =
    useChatSession();

  // collections
  const [loading, setLoading] = useState<boolean>(false);

  // query
  const [inputText, setInputText] = useState<string>("");
  const [isNewChat, setIsNewChat] = useState<boolean>(true);

  // file upload
  //const [isUploadedFiles, setIsUploadedFiles] = useState<boolean>(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [collectionNameInput, setCollectionNameInput] = useState("");

  useEffect(() => {
    if (documents.length > 0 && collectionNameInput === "") {
      setCurrentCollection(documents[0].name.slice(0, -4));
      console.log("here!");
    }
  }, [documents]);

  const guestPostData = async (
    inputText: string,
    collection: string,
    files: File[]
  ) => {
    console.log("Collection: ", currentCollection);
    setLoadingResponse(true);
    const formData = new FormData();
    formData.append("query", inputText);
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });
    formData.append("collection", collection);
    formData.append("new_chat", isNewChat.toString());
    const endpoint = "http://localhost:5000/api/guest/query";
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

  const onSubmit = (input: string) => {
    if (documents.length === 0 && currentCollection === "") {
      toast(
        "Whoops! Please provide some documents to upload before submitting your query.",
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "custom-error-toast",
          hideProgressBar: true,
        }
      );
      return null;
    }
    if (input === "") {
      toast("Whoops! Doccy needs a query to work with!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "custom-error-toast",
        hideProgressBar: true,
      });
      return null;
    }
    if (sessionID === null) {
      const newId = uuid();
      setSessionID(newId);
      setIsNewChat(false);
    }
    setChatHistory((currentChatHistory) => [...currentChatHistory, input]);
    guestPostData(input, currentCollection, documents);

    setDocuments([]);

    // here we want to submit the query along with all the documents.

    // if the user is logged in:
    // record the query as a new chat session,
    // store this chat session in the db,
    // and get the response back

    // if the user is not logged in:
    // send the query, the documents and the collection name
    // get a response back

    // so we need to send the query, the documents, the collection name and the user JWT token
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
        {/*<IconButton icon={<ArrowUp className="text-black" size={20} />} />*/}

        {/*<IconButton icon={<Paperclip className="text-black" size={20} />} />*/}
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
          <div className="col-span-8">
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

export default ChatBoxGuest;
