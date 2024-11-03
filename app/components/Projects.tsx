"use client";
import React from "react";

const Projects = () => {
  const projects = [
    {
      name: "Project 1",
      description: "This is a project",
      image: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      link: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    },
    {
      name: "Project 2",
      description: "This is a project",
      image: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      link: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    },
    {
      name: "Project 3",
      description: "This is a project",
      image: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      link: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    },
    {
      name: "Project 4",
      description: "This is a project",
      image: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      link: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    },
    {
      name: "Project 5",
      description: "This is a project",
      image: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      link: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    },
    {
      name: "Project 6",
      description: "This is a project",
      image: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      link: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    },
  ];
  const [selectedProject, setSelectedProject] = React.useState(0);
  const projectHandler = (projectIndex: number) => {
    setSelectedProject(projectIndex);
  };
  return (
    <div className="flex w-full max-w-screen-2xl">
      <nav className="flex flex-col justify-center">
        {projects.map((project, index) => {
          return (
            <div
              key={index}
              className={`${selectedProject === index ? "bg-white" : ""} ml-3 rounded-l-lg py-3 pr-3 transition-colors duration-200`}
            >
              <button
                onClick={() => projectHandler(index)}
                className="ml-2 flex flex-row rounded-lg bg-black px-10 py-2 text-white hover:bg-gray-500"
              >
                <div className="flex flex-col">
                  <h1>{project.name}</h1>
                </div>
              </button>
            </div>
          );
        })}
      </nav>
      <div className="h-s mr-5 flex min-h-[800px] flex-1 flex-col items-center justify-center rounded-2xl bg-white">
        <h1>{projects[selectedProject].name}</h1>
        <p>{projects[selectedProject].description}</p>
        <img src={projects[selectedProject].image} alt={projects[selectedProject].name} />
        <a href={projects[selectedProject].link}>Link to project</a>
      </div>
    </div>
  );
};

export default Projects;
