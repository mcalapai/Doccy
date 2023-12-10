import { ChangeEvent } from "react";

interface QueryInputProps {
  text: string;
  setText: (value: string) => void;
}

const QueryInput: React.FC<QueryInputProps> = ({ text, setText }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 👇 Store the input value to local state
    setText(e.target.value);
  };

  return (
    <div className="bg-button-primary w-full h-fit rounded-full flex items-center justify-center px-[20px] py-[8px]">
      <input
        className="w-full h-fit text-sm text-black bg-button-primary outline-none border-none font-owners"
        type="text"
        placeholder="Search"
        value={text}
        onChange={handleChange}
      />
    </div>
  );
};

export default QueryInput;
