"use client";

import useAuthModal from "@/hooks/useAuthModel";
import Modal from "./Modal";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthModal = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const session = useSessionContext();
  const { setIsClosed, isOpen } = useAuthModal();

  useEffect(() => {
    if (session) {
      router.refresh();
      setIsClosed();
    }
  }, [session, router, setIsClosed]);

  const onChange = (open: boolean) => {
    if (!open) {
      setIsClosed();
    }
  };

  return (
    <Modal
      title="Welcome back"
      description="Login to your account"
      isOpen={isOpen}
      onChange={onChange}
    >
      <Auth
        theme="dark"
        providers={["github", "google"]}
        supabaseClient={supabaseClient}
        appearance={{
          extend: true,
          theme: ThemeSupa,
        }}
      />
    </Modal>
  );
};

export default AuthModal;
