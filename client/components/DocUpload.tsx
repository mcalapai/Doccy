import { useState, useRef, useEffect } from "react";
import { ChangeEvent, DragEvent } from "react";
import IconButton from "./IconButton";
import { Add, CloseCircle, Paperclip } from "iconsax-react";
import { motion, AnimatePresence } from "framer-motion";

interface DocUploadProps {
  isUploadedFiles: boolean;
  setIsUploadedFiles: React.Dispatch<React.SetStateAction<boolean>>;
}

const DocUpload: React.FC<DocUploadProps> = ({
  isUploadedFiles,
  setIsUploadedFiles,
}) => {
  const [documents, setDocuments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // custom input button
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // file upload handling
  const addFiles = (newFiles: File[]) => {
    setDocuments((prev) => [...prev, ...newFiles].slice(0, 10)); // limit to 10 documents
  };

  const removeFiles = () => {
    setDocuments([]);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // prevent default to allow drop
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  useEffect(() => {
    if (documents.length > 0) {
      setIsUploadedFiles(true);
    } else if (documents.length === 0) {
      setIsUploadedFiles(false);
    }
  }, [documents]);

  return (
    <>
      <AnimatePresence>
        {documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, transform: "translateY(10px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.1 }}
            className="absolute bottom-full 
      bg-background-primary rounded-[20px] w-[200px] "
          >
            <IconButton
              className="text-black top-0 right-0 -mt-[5px] -mr-[10px] p-[1px] absolute z-100 rotate-45"
              icon={<Add size={20} />}
              onClick={removeFiles}
            />
            <div className="flex flex-col px-[22px] py-[14px]">
              {documents.map((doc, index) => {
                return (
                  <p className="font-owners overflow-hidden whitespace-nowrap text-ellipsis">
                    {doc.name}
                  </p>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className=""
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={(e) => console.log(e.target.files)}
          ref={fileInputRef}
          className="hidden"
        />
        {isDragging ? (
          <IconButton
            onClick={handleButtonClick}
            icon={<Add className="text-black" size={20} />}
          />
        ) : (
          <IconButton
            onClick={handleButtonClick}
            icon={<Paperclip className="text-black" size={20} />}
          />
        )}
      </div>
    </>
  );
};

export default DocUpload;

/*
<div className="relative">
      {documents.length > 0 && (
        <div className="absolute mb-[500px]">Documents added!</div>
      )}
      <div
        className=""
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="w-[20px]"
        />
        {isDragging ? (
          <IconButton icon={<Add className="text-black" size={20} />} />
        ) : (
          <IconButton icon={<Paperclip className="text-black" size={20} />} />
        )}
      </div>
    </div>
    */
