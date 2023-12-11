"use client";

import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import IconButton from "./IconButton";
import { User } from "iconsax-react";
import CollectionDropdown from "./CollectionDropdown";
import { useEffect, useState } from "react";
import useCollections from "@/hooks/useCollections";

const Sidebar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  return (
    <div className="w-[250px] h-full flex flex-col gap-y-10 text-text-primary p-4 bg-background-primary border-r border-main-outline">
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
          Upload and chat with your documents
        </p>
      </div>
      <div className="flex flex-col gap-y-2 font-owners">
        <p className="font-semibold text-xl">Select collection</p>
      </div>
      <div className="flex flex-col gap-y-2 font-owners">
        <p className="font-semibold text-xl">New collection</p>
      </div>
      {user && (
        <div className="flex flex-col gap-y-2 font-owners">
          <p className="font-semibold text-xl">Chat History</p>
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
