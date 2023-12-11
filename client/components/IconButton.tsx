import { Icon } from "iconsax-react";
import { forwardRef } from "react";

interface IconButtonProps {
  className?: string;
  onClick?: () => void;
  icon: React.ReactElement;
}

const IconButton: React.FC<IconButtonProps> = ({
  className,
  onClick,
  icon,
}) => {
  return (
    <button
      className={`bg-button-primary w-fit h-fit rounded-full flex items-center justify-center p-[8px] transition-all \
    hover:bg-button-hover \
      active:bg-button-active ${className}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default IconButton;
