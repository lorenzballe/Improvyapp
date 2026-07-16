import React from "react";

interface ExpandableButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

export function ExpandableButton({
  text = "Go Back",
  className = "",
  onClick,
}: ExpandableButtonProps) {
  return (
    <button
      className={`bg-white text-center w-52 rounded-2xl h-14 relative text-black text-lg font-semibold group cursor-pointer shadow-lg shadow-black/40 transition-transform active:scale-95 overflow-hidden ${className}`}
      type="button"
      onClick={onClick}
    >
      <div
        className="bg-emerald-400 rounded-xl h-12 w-12 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[200px] z-10 duration-500 ease-out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          height="22px"
          width="22px"
          className="group-hover:rotate-180 duration-500 ease-out"
        >
          <path
            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
            fill="#000000"
          ></path>
          <path
            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
            fill="#000000"
          ></path>
        </svg>
      </div>
      <p className="translate-x-4 text-zinc-900 group-hover:opacity-0 duration-300 transition-opacity whitespace-nowrap pr-2">
        {text}
      </p>
    </button>
  );
}
