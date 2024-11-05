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
    <div className="relative flex w-full max-w-screen-2xl flex-col px-4 lg:flex-row lg:px-0">
      <nav className="flex flex-col items-center justify-center lg:items-start">
        <div className="lg:hidden">
          <select
            name="project"
            onChange={(e) => projectHandler(parseInt(e.target.value))}
            value={selectedProject}
            className="mb-4 max-w-fit cursor-pointer rounded-lg bg-black px-10 py-2 text-center text-white outline-offset-2 hover:bg-gray-500 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
          >
            {projects.map((project, index) => (
              <option key={index} value={index}>
                {project.label}
              </option>
            ))}
          </select>
        </div>
        {projects.map((project, index) => (
          <div
            key={index}
            className={`${
              selectedProject === index ? "bg-white" : ""
            } ml-3 hidden w-full rounded-l-lg py-3 pr-3 transition-colors duration-200 lg:block`}
          >
            <button
              onClick={() => projectHandler(index)}
              disabled={selectedProject === index}
              className={`ml-2 flex min-w-52 flex-row rounded-lg bg-black px-10 py-2 text-white outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black ${
                selectedProject !== index ? "hover:bg-neutral-700" : ""
              } font-bold`}
            >
              {project.label}
            </button>
          </div>
        ))}
      </nav>

      <div className="flex flex-1 flex-col items-center">
        <h2 className="mb-4 text-center text-2xl">Projects!</h2>
        <div className="h-s max-4 relative flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl bg-white lg:mx-5">
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
              className="absolute inset-0 h-full w-full"
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
