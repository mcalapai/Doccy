import Button from "@/components/Button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="h-full w-full bg-background-secondary">
      <div className="flex w-full h-full justify-center items-center text-center font-bold gap-x-6 pb-[66px] -mt-[66px]">
        <p className="text-background-primary select-none font-lustig text-[20rem] opacity-50 leading-none">
          Doccy
        </p>
      </div>
    </main>
  );
}
