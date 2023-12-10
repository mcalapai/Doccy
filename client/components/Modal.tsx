import * as Dialog from "@radix-ui/react-dialog";
import { CloseCircle } from "iconsax-react";

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onChange,
  title,
  description,
  children,
}) => {
  return (
    <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-neutral-900/90 backdrop-blur-sm fixed inset-0">
          <Dialog.Content
            className="fixed drop-shadow-md rounded-[20px] border 
          border-main-outline top-[50%] left-[50%] max-h-full 
          h-full md:h-auto md:max-h-[85vh] w-full 
          md:w-[90vw] md:max-w-[450px] translate-x-[-50%] translate-y-[-50%] 
          bg-background-primary p-[25px]"
          >
            <Dialog.Title className="font-normal font-owners text-xl">
              {title}
            </Dialog.Title>
            <Dialog.Description className="font-normal font-owners text-md">
              {description}
            </Dialog.Description>
            <div>{children}</div>
            <Dialog.Close asChild>
              <button
                className="text-button-primary hover:text-button-hover 
              absolute top-[10px] right-[10px] 
              inline-flex h-[25px] w-[25px] 
              appearance-none justify-center 
              rounded-full focus:outline-none transition-all"
              >
                <CloseCircle />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
