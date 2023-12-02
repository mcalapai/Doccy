const QueryInput = () => {
  return (
    <div className="bg-button-primary w-full h-fit rounded-full flex items-center justify-center px-[20px] py-[8px]">
      <input
        className="w-full h-fit text-sm text-black bg-button-primary outline-none border-none"
        type="text"
        placeholder="Search"
      />
    </div>
  );
};

export default QueryInput;
