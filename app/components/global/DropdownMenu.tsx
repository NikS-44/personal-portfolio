"use client";
import { useEffect, useRef } from "react";

interface DropdownItem {
  id: number;
  name: string;
  href: string;
  description?: string;
}

interface DropdownMenuProps {
  title: string;
  items: DropdownItem[];
  isOpen: boolean;
  onToggle: () => void;
}

const DropdownMenu = ({ title, items, isOpen, onToggle }: DropdownMenuProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-1 transition-colors duration-300 hover:text-cyan-400"
      >
        <span>{title}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-1/2 top-full z-10 mt-4 w-fit -translate-x-1/2 rounded-md border border-solid border-cyan-950 bg-neutral-900 shadow-lg">
          <div className="py-1">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="block px-8 py-2 text-base hover:bg-neutral-700"
                onClick={() => onToggle()}
              >
                <div className="text-center font-medium">{item.name}</div>
                {item.description && <div className="text-xs text-gray-400">{item.description}</div>}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
