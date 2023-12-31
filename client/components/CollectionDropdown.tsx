import React from "react";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/autocomplete";
import { useState, useEffect, useRef, useReducer } from "react";
import useCollections from "@/hooks/useCollections";
import { motion, AnimatePresence } from "framer-motion";
import useChatSession from "@/hooks/useChatSession";
import { useUser } from "@/hooks/useUser";
import useCollectionDisplayNames from "@/hooks/useCollectionDisplayNames";

interface CollectionDropdownProps {
  collections: string[];
  disabled: boolean;
}

const CollectionDropdown: React.FC<CollectionDropdownProps> = ({
  collections,
  disabled,
}) => {
  const { currentCollection, setCurrentCollection } = useCollections();
  const { userDetails } = useUser();

  const collectionDisplayNames = useCollectionDisplayNames(
    collections,
    userDetails?.id
  );

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [filteredOptions, setFilteredOptions] = useState<string[]>(
    collectionDisplayNames
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onChange = (option: string) => {
    setCurrentCollection(option);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    setFilteredOptions(
      collectionDisplayNames.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, collections]);

  const handleSelect = (value: string) => {
    let colNameUser = "";
    if (userDetails) {
      colNameUser = userDetails?.id + "___" + value;
    } else {
      colNameUser = value;
    }
    setCurrentCollection(colNameUser);
    setSearchTerm(value); // Update the search term to the selected value
    onChange(colNameUser);
    setIsOpen(false);
  };

  // code to set selection in backend

  return (
    <div ref={wrapperRef} className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute z-10 w-full bg-button-primary rounded-[20px] mb-2 py-2 overflow-auto bottom-full text-black"
          >
            {filteredOptions.map((option, index) => (
              <motion.li
                key={index}
                onClick={() => handleSelect(option)}
                className="px-[22px] py-1 cursor-pointer hover:text-background-tertiary transition-all font-owners text-sm"
              >
                {option}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {!disabled ? (
        <input
          type="text"
          value={currentCollection.replace(`${userDetails?.id}___`, "")}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => {
            setSearchTerm("");
            setIsOpen(!isOpen);
          }}
          className="w-full px-4 py-2 bg-button-primary text-black rounded-full focus:outline-none bottom-full text-sm font-owners"
          placeholder="Select a collection..."
        />
      ) : (
        <p className="w-full px-4 py-2 bg-button-primary text-black rounded-full focus:outline-none bottom-full text-sm font-owners">
          {currentCollection.replace(`${userDetails?.id}___`, "")}
        </p>
      )}
    </div>
  );
};

export default CollectionDropdown;
