"use client";

import useAuthModal from "@/hooks/useAuthModel";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const authModal = useAuthModal();
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out");
    }
  };

  return (
    <div className="flex w-full h-full items-end justify-end bg-opacity-0">
      {user ? (
        <Button text="Log out" onClick={handleLogout} />
      ) : (
        <Button text="Sign in" onClick={authModal.setIsOpen} />
      )}
    </div>
  );
};

export default Navbar;
