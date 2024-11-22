"use client";
import React from "react";
import { Transition } from "@headlessui/react";
import TopNavigation from "@/app/components/projects/TopNavigation";
import Footer from "@/app/components/projects/Footer";

const Projects = () => {
  const projects = [
    {
      label: "shopbop.com Top Navigation",
      component: <TopNavigation />,
    },
    {
      label: "shopbop.com Footer",
      component: <Footer />,
    },
  ];

  const [selectedProject, setSelectedProject] = React.useState(0);

  const projectHandler = (projectIndex: number) => {
    setSelectedProject(projectIndex);
  };

  return (
    <div className="relative flex w-full max-w-screen-2xl flex-col px-4 text-white">
      <h2 className="mb-4 text-center text-2xl">My Projects!</h2>
      <nav className="flex flex-col items-center justify-center">
        <select
          name="project"
          onChange={(e) => projectHandler(parseInt(e.target.value))}
          value={selectedProject}
          className="border-1 mb-4 max-w-fit cursor-pointer rounded-lg border-2 border-cyan-600 bg-black px-10 py-2 text-center outline-offset-2 outline-cyan-400 hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
        >
          {projects.map((project, index) => (
            <option key={index} value={index}>
              {project.label}
            </option>
          ))}
        </select>
      </nav>

      <div className="flex flex-1 flex-col items-center">
        <div className="max-4 relative flex w-full flex-col items-center justify-center rounded-2xl bg-gray-400 lg:mx-5">
          {projects.map((project, index) => (
            <Transition
              as="div"
              key={index}
              show={selectedProject === index}
              enter="transition-opacity duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="inset-0 h-full w-full"
            >
              {project.component}
            </Transition>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
