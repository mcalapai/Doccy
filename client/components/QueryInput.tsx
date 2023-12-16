import useChatSession from "@/hooks/useChatSession";
import { ChangeEvent } from "react";

interface QueryInputProps {
  placeholder: string;
  text: string;
  setText: (value: string) => void;
  className?: string;
  onEnter?: () => void;
}

const QueryInput: React.FC<QueryInputProps> = ({
  placeholder,
  text,
  setText,
  className,
  onEnter,
}) => {
  const { loadingResponse } = useChatSession();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 👇 Store the input value to local state
    setText(e.target.value);
  };

  return (
    <div
      className={`bg-button-primary w-full h-fit rounded-full flex items-center justify-center px-[20px] py-[8px] ${className}`}
    >
      <input
        className="w-full h-fit text-sm text-black bg-button-primary outline-none border-none font-owners"
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        disabled={loadingResponse}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) {
            setText("");
            onEnter();
          }
        }}
      />
    </div>
  );
};

export default QueryInput;
