"use client";

import Button from "./Button";

const Navbar = () => {
  return (
    <div className="flex w-full h-full items-end justify-end">
      <Button text="Sign in" onClick={() => console.log("Sign in clicked.")} />
    </div>
  );
};

export default Navbar;
