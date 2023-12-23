"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/Button";
import useChatSession from "@/hooks/useChatSession";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import SkeletonLine from "@/components/Skeleton";

export default function Home() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { loadingResponse, setLoadingResponse, chatHistory, setChatHistory } =
    useChatSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [loadingResponse]);

  return (
    <main className="h-full w-full bg-background-secondary">
      {chatHistory.length === 0 ? (
        <div className="flex w-full h-full justify-center items-center text-center font-bold gap-x-6 -mt-[70px]">
          <p className="text-background-primary select-none font-lustig text-[20rem] opacity-50 leading-none">
            Doccy
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:px-[200px] xl:px-[300px] py-5 gap-y-[48px]">
          {chatHistory.map((item, index) => {
            const from = index % 2 === 0 ? "You" : "Doccy";
            return (
              <AnimatePresence key={index}>
                <motion.div
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="font-ownersNarrow font-bold text-[20px]">
                    {from}
                  </p>
                  <p className="font-owner font-normal text-[20px] break-words whitespace-pre-wrap">
                    {item}
                  </p>
                </motion.div>
              </AnimatePresence>
            );
          })}
          {loadingResponse && (
            <AnimatePresence>
              <motion.div
                className="flex flex-col space-y-[10px]"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="font-ownersNarrow font-bold text-[20px]">Doccy</p>
                <SkeletonLine height={3} rows={5} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
      <div ref={messagesEndRef} />
    </main>
  );
}
