"use client";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";

export interface DropdownItem {
  id: number | string;
  name: string;
  href: string;
  external?: boolean;
  /** Shown as a title-block stamp, e.g. work still being laid out. */
  status?: "wip";
  detail?: string;
}

interface DropdownMenuProps {
  title: string;
  items: DropdownItem[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function WipStamp() {
  return (
    <span className="t-label inline-flex items-center gap-1.5 rounded-sm border border-dashed border-copper-dim px-1.5 py-0.5 text-[0.5625rem] tracking-[0.14em] text-copper">
      <span aria-hidden className="h-1 w-1 rounded-full bg-copper" />
      WIP
    </span>
  );
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
          className="fixed inset-x-3 top-[3.75rem] z-20 overflow-hidden rounded-sm border border-rule-strong bg-ground-2 py-1 shadow-2xl shadow-black/40 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:min-w-[14.5rem]"
        >
          {items.map((item) => {
            const content = (
              <>
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm text-ink-2 group-hover:text-ink">{item.name}</span>
                  {item.status === "wip" && <WipStamp />}
                </span>
                {item.detail && <span className="t-mono mt-0.5 block text-[0.6875rem] text-ink-3">{item.detail}</span>}
              </>
            );

            const className =
              "group block px-4 transition-colors hover:bg-ground-3 " +
              (item.detail || item.status ? "py-3" : "py-2.5");

            if (item.external) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  role="menuitem"
                  onClick={onClose}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.status === "wip" ? `${item.name}, work in progress` : undefined}
                  className={className}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                role="menuitem"
                onClick={onClose}
                aria-label={item.status === "wip" ? `${item.name}, work in progress` : undefined}
                className={className}
              >
                {content}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
