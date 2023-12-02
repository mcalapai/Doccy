"use client";

import { twMerge } from "tailwind-merge";

interface ButtonProps {
  text: string;
  className?: string;
  onClick: () => void;
  icon?: React.ReactElement;
}

const Button: React.FC<ButtonProps> = ({ text, className, onClick, icon }) => {
  return (
    <button
      onClick={() => onClick()}
      className={twMerge(
        `bg-main-primary rounded-full h-fit w-fit px-[26px] py-[8px] flex items-center justify-center leading-none transition-all \
        hover:bg-button-active
        active:bg-button-active`,
        className
      )}
    >
      <p className=" font-ownersNarrow font-bold text-black opacity-40">
        {text}
      </p>
    </button>
  );
};

export default Button;
