import { ArrowUp, Paperclip, Send } from "iconsax-react";
import IconButton from "./IconButton";
import QueryInput from "./QueryInput";

const ChatBox = () => {
  return (
    <div className="rounded-[20px] border border-main-outline bg-background-primary w-full px-[22px] py-[14px]">
      <div className="w-full h-full gap-x-[12px] flex flex-row">
        <IconButton icon={<ArrowUp className="text-black" size={20} />} />
        <IconButton icon={<Paperclip className="text-black" size={20} />} />
        <QueryInput />
        <IconButton icon={<Send className="text-black" size={20} />} />
      </div>
    </div>
  );
};

export default ChatBox;
