import React from "react";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/autocomplete";
import { useState, useEffect, useRef } from "react";
import useCollections from "@/hooks/useCollections";
import { motion, AnimatePresence } from "framer-motion";

interface CollectionDropdownProps {
  collections: string[];
}

const CollectionDropdown: React.FC<CollectionDropdownProps> = ({
  collections,
}) => {
  const { currentCollection, setCurrentCollection } = useCollections();

  const onChange = (option: string) => {
    setCurrentCollection(option);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>(collections);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
      collections.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, collections]);

  const handleSelect = (value: string) => {
    setCurrentCollection(value);
    setSearchTerm(value); // Update the search term to the selected value
    onChange(value);
    setIsOpen(false);
  };

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
      <input
        type="text"
        value={currentCollection}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={() => {
          setCurrentCollection("");
          setSearchTerm("");
          setIsOpen(!isOpen);
        }}
        className="w-full px-4 py-2 bg-button-primary text-black rounded-full focus:outline-none bottom-full text-sm font-owners"
        placeholder="Select a collection..."
      />
    </div>
  );
};

export default CollectionDropdown;
