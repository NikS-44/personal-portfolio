import React, { useEffect, useRef } from "react";
import Image from "next/image";

interface ImageModalProps {
  imageSrc: string;
  imageHeight: number;
  imageWidth: number;
  onClose: () => void;
  imageAltText?: string;
  isOpen: boolean; // Add this prop to control dialog open state
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageSrc,
  imageHeight,
  imageWidth,
  onClose,
  imageAltText,
  isOpen,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    const dialogDimensions = dialogRef.current?.getBoundingClientRect();
    if (!dialogDimensions) return;

    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="no-doc-scroll fixed m-auto h-fit max-h-[90vh] w-fit max-w-[calc(100vw-2.5rem)] cursor-pointer rounded-xl border-none bg-transparent p-0 outline-none backdrop:bg-black/90 backdrop:backdrop-blur-sm"
    >
      <div
        className="animate-fadeIn relative transform cursor-default rounded-xl bg-gradient-to-b from-cyan-950 to-cyan-900 p-10 shadow-2xl ring-1 ring-white/10 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 z-10 h-7 w-7 rounded-lg border border-cyan-800/50 bg-cyan-900/50 text-white/80 transition-all hover:scale-105 hover:border-cyan-600 hover:bg-cyan-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="p-1">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <Image
          src={imageSrc}
          alt={imageAltText ?? ""}
          width={imageWidth}
          height={imageHeight}
          className="h-auto max-w-full rounded-lg shadow-xl ring-1 ring-white/10 transition-transform"
        />
      </div>
    </dialog>
  );
};

export default ImageModal;
