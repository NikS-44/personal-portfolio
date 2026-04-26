"use client";

export async function exportCardAsJpeg(element: HTMLElement, filename: string): Promise<void> {
  element.setAttribute("data-export", "true");
  try {
    const { default: html2canvas } = await import("html2canvas");
    const options = {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    } as Parameters<typeof html2canvas>[1];
    const canvas = await html2canvas(element, options);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  } finally {
    element.removeAttribute("data-export");
  }
}
