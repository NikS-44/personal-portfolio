"use client";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";

interface DropdownItem {
  id: number;
  name: string;
  href: string;
}

interface DropdownMenuProps {
  title: string;
  items: DropdownItem[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function DropdownMenu({ title, items, isOpen, onToggle, onClose }: DropdownMenuProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      onClose();
      triggerRef.current?.focus();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        className="flex items-center gap-1.5 py-1 transition-colors hover:text-copper aria-expanded:text-copper"
      >
        {title}
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
        >
          <path d="M3.5 6L8 10.5 12.5 6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-20 mt-3 min-w-[13rem] overflow-hidden rounded-sm border border-rule-strong bg-ground-2 py-1 shadow-2xl shadow-black/40"
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              role="menuitem"
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-ink-2 transition-colors hover:bg-ground-3 hover:text-ink"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
