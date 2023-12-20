"use client";

import { ArrowUp, Paperclip, Send } from "iconsax-react";
import IconButton from "./IconButton";
import QueryInput from "./QueryInput";
import { useStore } from "@/store/store";
import { useState, useEffect } from "react";
import CollectionDropdown from "./CollectionDropdown";
import useCollections from "@/hooks/useCollections";
import DocUpload from "./DocUpload";
import useChatSession from "@/hooks/useChatSession";
import uuid from "react-uuid";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./components.css";

const ChatBox = () => {
  // chat session
  const { currentCollection, collections, setCollections } = useCollections();
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

  // query
  const [inputText, setInputText] = useState("");

  // file upload
  //const [isUploadedFiles, setIsUploadedFiles] = useState<boolean>(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [collectionNameInput, setCollectionNameInput] = useState("");

  // user
  const supabaseClient = useSupabaseClient();
  const { user, userDetails, accessToken } = useUser();

  useEffect(() => {
    if (documents.length > 0 && collectionNameInput === "") {
      setCollectionNameInput(documents[0].name.slice(0, -4));
    }
  }, [documents]);

  useEffect(() => {
    console.log("Collection changed to: ", currentCollection);
  }, [currentCollection]);

  const userPostData = async (
    inputText: string,
    accessToken: string,
    collection?: string,
    files?: File[]
  ) => {
    setLoadingResponse(true);

    const formData = new FormData();
    formData.append("query", inputText);
    formData.append("access_token", accessToken);
    if (files) {
      console.log("files");
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
    }
    if (collection) {
      const collectionName = collection.replace(`${userDetails?.id}___`, "");
      formData.append("collection", collectionName);
    }

    console.log(formData);

    const endpoint = "http://127.0.0.1:5000/api/user/query";
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

  const guestPostData = async (
    inputText: string,
    collection: string,
    files?: File[]
  ) => {
    setLoadingResponse(true);
    const endpoint = "http://localhost:5000/api/guest/query";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: inputText,
          files: files ? files : null,
          collection: collection,
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
    setLoadingResponse(false);
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
    if (user && accessToken) {
      // append to user input history
      if (sessionID === null) {
        const newId = uuid();
        setSessionID(newId);
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
        userPostData(
          input,
          accessToken,
          userDetails?.id + "___" + currentCollection
        );
      }
    } else {
      setChatHistory((currentChatHistory) => [...currentChatHistory, input]);
      if (documents.length > 0) {
        guestPostData(input, currentCollection, documents);
      } else {
        guestPostData(input, currentCollection);
      }
    }

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
    fetch(`http://127.0.0.1:5000/api/get-collections`)
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

export default ChatBox;
