import React, { useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { inputStyles } from "@/app/components/projects/Input";

type TextAreaProps = {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeHolder?: string;
  className?: string;
  autoResize?: boolean;
};

const TextArea = ({
  label,
  value,
  onChange,
  placeHolder = "",
  className,
  autoResize = false, // Default is false
}: TextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height
    }
  }, [value, autoResize]); // Trigger adjustment when value or autoResize changes

  return (
    <div className="mt-6">
      <label className="mb-1 block text-sm font-semibold text-gray-300">
        {label}:
        <textarea
          ref={textareaRef}
          placeholder={placeHolder}
          value={value}
          onChange={onChange}
          className={twMerge(inputStyles, className)}
          style={autoResize ? { overflow: "hidden", resize: "none" } : {}}
        />
      </label>
    </div>
  );
};

export default TextArea;
