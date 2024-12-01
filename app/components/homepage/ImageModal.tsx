import React, { useEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";

interface ImageModalProps {
  imageSrc: StaticImageData;
  title: React.ReactNode;
  imageHeight: number;
  imageWidth: number;
  onClose: () => void;
  imageAltText?: string;
  isOpen: boolean; // Add this prop to control dialog open state
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageSrc,
  title,
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
      className="fixed m-auto max-h-[90vh] w-fit max-w-[calc(100vw-2.5rem)] rounded-xl border-none bg-transparent p-0 outline-none backdrop:bg-black/90 backdrop:backdrop-blur-sm"
    >
      <div
        className="animate-fadeIn relative transform cursor-default rounded-xl bg-gradient-to-b from-cyan-950 to-cyan-900 p-10 shadow-2xl ring-1 ring-white/10 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-2 top-2 z-10 h-7 w-7 rounded-lg border border-cyan-800/50 bg-cyan-900/50 text-white/80 transition-all hover:scale-105 hover:border-cyan-600 hover:bg-cyan-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <h2 className="mb-3 text-center text-white">{title}</h2>
        <div className="max-h-[calc(90vh-4rem)] overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAltText ?? ""}
            width={imageWidth}
            height={imageHeight}
            className="h-auto max-h-[calc(90vh-8rem)] w-auto max-w-full rounded-lg object-contain shadow-xl ring-1 ring-white/10"
          />
        </div>
      </div>
    </dialog>
  );
};

export default ImageModal;
