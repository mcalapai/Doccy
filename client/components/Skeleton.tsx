import React from "react";
import "./components.css";

type SkeletonLineProps = {
  baseColor?: string;
  highlightColor?: string;
  height?: string | number;
  rows?: number;
};

const SkeletonLine: React.FC<SkeletonLineProps> = ({
  baseColor = "<bg-gray-7></bg-gray-7>00",
  highlightColor = "#FFFFFF", // default highlight color in HEX
  height,
  rows = 1,
}) => {
  const highlightStyle = {
    background: `linear-gradient(90deg, 
                                transparent, 
                                ${highlightColor} 50%, 
                                transparent 100%)`,
  };

  const skeletonHeight =
    typeof height === "number" ? `h-${height}` : `h-[${height}]`;

  console.log(skeletonHeight);

  return (
    <>
      {Array.from(Array(rows)).map((_, index) => {
        return (
          <div
            key={index}
            className={`${baseColor} ${skeletonHeight} opacity-20 relative overflow-hidden rounded-full`}
          >
            <div className="skeleton-highlight" style={highlightStyle} />
          </div>
        );
      })}
    </>
  );
};

export default SkeletonLine;
