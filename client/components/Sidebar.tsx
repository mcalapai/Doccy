const Sidebar = () => {
  return (
    <div className="w-[250px] h-full flex flex-col gap-y-10 text-text-primary p-4 bg-background-primary border-r border-main-outline">
      <div className="flex flex-col pt-2">
        <p className="font-bold text-[10rem] font-lustig leading-extra-small">
          Hello,<br></br>name!
        </p>
        <p className="font-normal text-md pt-2 font-owners text-lg">
          Upload and chat with your documents
        </p>
      </div>
      <div className="flex flex-col gap-y-2">
        <p className="font-semibold text-xl">Select collection</p>
      </div>
      <div className="flex flex-col gap-y-2">
        <p className="font-semibold text-xl">New collection</p>
      </div>
    </div>
  );
};

export default Sidebar;
