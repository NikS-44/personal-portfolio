import ImageModal from "@/app/components/homepage/ImageModal";
import React from "react";

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: StaticImageData;
  details?: {
    image: StaticImageData;
    title: React.ReactNode;
    altText: string;
    width: number;
    height: number;
  };
}

import { useState, useRef } from "react";
import Image, { StaticImageData } from "next/image";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  return (
    <div
      className={`group relative mx-2 w-80 flex-shrink-0 ${project.details ? "cursor-pointer" : "cursor-default"} overflow-hidden rounded-lg border-2 border-cyan-900/30 bg-neutral-900/50 transition-all duration-300 hover:border-cyan-700/50 hover:bg-neutral-900/80`}
      onClick={() => project.details && onSelect(project)}
    >
      {project.details && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-neutral-900/70 p-2 text-gray-400 transition-all duration-300 group-hover:bg-neutral-800 group-hover:text-cyan-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path
              fillRule="evenodd"
              d="M3.75 4.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5H5.56l3.72 3.72a.75.75 0 11-1.06 1.06L4.5 6.31v3.94a.75.75 0 11-1.5 0v-4.5zm16.5 0a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h3.44l-3.72 3.72a.75.75 0 101.06 1.06l3.72-3.72v3.94a.75.75 0 001.5 0v-4.5zm-16.5 15a.75.75 0 00.75.75h4.5a.75.75 0 000-1.5H5.56l3.72-3.72a.75.75 0 00-1.06-1.06L4.5 17.69v-3.94a.75.75 0 00-1.5 0v4.5zm16.5 0a.75.75 0 01-.75.75h-4.5a.75.75 0 010-1.5h3.44l-3.72-3.72a.75.75 0 011.06-1.06l3.72 3.72v-3.94a.75.75 0 011.5 0v4.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      <div className="relative h-32 w-full">
        <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold text-white group-hover:text-cyan-400">{project.title}</h3>
        <p className="text-sm text-gray-400">{project.description}</p>
      </div>
    </div>
  );
};

interface ProjectCarouselProps {
  projects: Project[];
}

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // Adjust based on card width + margin
      const currentScroll = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative mx-auto my-5 max-w-screen-lg px-4">
      <div className="mb-2 text-center">
        <h2 className="mb-3 text-xl font-bold text-white">Featured Projects</h2>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 rounded-full bg-cyan-900/80 p-2 text-white transition-colors hover:bg-cyan-800"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div ref={scrollContainerRef} className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-8 py-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={(p) => setSelectedProject(p)} />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 rounded-full bg-cyan-900/80 p-2 text-white transition-colors hover:bg-cyan-800"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {selectedProject && selectedProject.details && (
        <ImageModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.details.title}
          imageSrc={selectedProject.details.image}
          imageAltText={selectedProject.details.altText}
          imageWidth={selectedProject.details.width}
          imageHeight={selectedProject.details.height}
        />
      )}
    </div>
  );
};