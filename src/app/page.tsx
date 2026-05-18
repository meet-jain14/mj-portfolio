"use client";

import Container from "../components/Container";
import Navbar from "../components/Navbar";
import MagneticButton from "../components/MagneticButton";
import AmbientGlow from "../components/AmbientGlow";
import Section from "../components/Section";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";
import { useState } from "react";

export default function Home() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  return (
    <main className="min-h-screen">
      <AmbientGlow />

      <Navbar />

      <div className="relative z-10">
        <Container>

          {/* Hero Section */}
          <section className="flex min-h-[90vh] items-center pt-24">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#00ffae]">
                AI ENGINEER • FULL STACK DEVELOPER
              </p>

              <h1 className="max-w-5xl text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-8xl">
                Crafting intelligent interfaces
                for the next generation of the web.
              </h1>

              <p className="mt-6 max-w-2xl text-lg text-gray-400">
                Building immersive AI-powered products, cinematic interfaces,
                and high-performance full stack experiences with modern web technologies.
              </p>

              <div className="mt-12 flex flex-wrap gap-5">
                <MagneticButton strength={0.2}>
                  <button className="rounded-full border border-[#00ffae]/20 bg-[#00ffae]/12 px-8 py-4 text-sm font-medium tracking-wide text-[#00ffae] shadow-[0_0_30px_rgba(0,255,174,0.03)] backdrop-blur-md transition-colors duration-300 hover:bg-[#00ffae]/25">
                    View Projects
                  </button>
                </MagneticButton>

                <MagneticButton strength={0.2}>
                  <button className="rounded-full border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-medium tracking-wide text-white shadow-[0_0_30px_rgba(0,255,174,0.03)] transition-colors duration-300 hover:bg-white/[0.07]">
                    Download Resume
                  </button>
                </MagneticButton>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <Section
            id="projects"
            subtitle="FEATURED WORK"
            title="Selected projects built with interaction, performance, and intelligent systems in mind."
          >
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            {projects.map((project) => {
              const isExpanded = activeProject === project.title;
              const hasActiveProject = activeProject !== null;
              const isInactive =
                hasActiveProject && !isExpanded;

              return (
                <ProjectCard
                  key={project.title}
                  category={project.category}
                  title={project.title}
                  description={project.description}
                  stack={project.stack}
                  accent={project.accent}
                  expanded={isExpanded}
                  onToggle={() =>
                    setActiveProject(
                      isExpanded ? null : project.title
                    )
                  }
                  inactive={isInactive}
                />
              );
            })}
            </div>
          </Section>

        </Container>
      </div>
    </main>
  );
}