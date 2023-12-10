"use client";

import useAuthModal from "@/hooks/useAuthModel";
import Button from "./Button";

const Navbar = () => {
  const authModal = useAuthModal();
  return (
    <div className="flex w-full h-full items-end justify-end bg-opacity-0">
      <Button text="Sign in" onClick={authModal.onOpen} />
    </div>
  );
};

export default Navbar;
