import { SupabaseClient, useSupabaseClient } from "@supabase/auth-helpers-react";

export const getCollectionData = async (userId: string) => {
    const formData = new FormData();
    formData.append("chat_title", "UserChatTest");
    formData.append("access_token", userId);

    const endpoint = "http://127.0.0.1:5000/api/get-collections";
    const response = await fetch(endpoint, {
        method: "GET",
        body: formData,
    });
    const data = await response.json();
    return data.collections;
};

export const saveChat = async (
    accessToken: string,
    chatTitle: string,
    userId: string,
    sessionId: string
  ) => {
    const formData = new FormData();
    formData.append("chat_title", chatTitle);
    formData.append("user_id", userId);
    formData.append("file_id", sessionId);
    formData.append("access_token", accessToken);

    const endpoint = "http://127.0.0.1:5000/api/user/save-chat";
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

export const postUserQuery = async (inputText: string,
    accessToken: string,
    collection: string,
    files?: File[]
) => {
  const formData = new FormData();
  formData.append("query", inputText);
  formData.append("access_token", accessToken);
  if (files) {
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });
  }
  formData.append("collection", collection);

  const endpoint = "http://127.0.0.1:5000/api/user/query";
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();

  if (data.status !== "success") {
    throw new Error("Something went wrong");
  }

  const chat_object = {
    "chat_history": data.chat_history,
    "chat_title": data.chat_title,
  };

  console.log("Chat title: ", data.chat_title)

  return chat_object;
};

export const getChatHistory = async (supabase: SupabaseClient, userID: string) => {
    console.log("User details: ", userID);
    let { data: chats, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userID)
      .order("created_at", { ascending: false });

    return chats;
};

export const loadSavedChat = async (
    accessToken: string,
    filePath: string,
  ) => {
    const formData = new FormData();
    formData.append("file_path", filePath);
    formData.append("access_token", accessToken);

	console.log("Here")

	const endpoint = "http://127.0.0.1:5000/api/user/load-saved-chat";
	try {
		const response = await fetch(endpoint, {
		method: "POST",
		body: formData,
		});
		const data = await response.json();

		return data;
	} catch (error) {
		console.log(error);
	}
};