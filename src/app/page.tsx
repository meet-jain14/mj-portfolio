import Container from "../components/Container";
import Navbar from "../components/Navbar";
import MagneticButton from "../components/MagneticButton";
import AmbientGlow from "../components/AmbientGlow";

export default function Home() {
  return (
    <main className="min-h-screen">
      <AmbientGlow />
      <Navbar />
      <div className="relative z-10">
        <Container>
          <section className="flex min-h-screen items-center pt-24">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#00ffae]">
                AI ENGINEER • FULL STACK DEVELOPER
              </p>

              <h1 className="max-w-4xl text-6xl font-bold leading-tight md:text-8xl">
                Building immersive digital experiences.
              </h1>

              <p className="mt-6 max-w-2xl text-lg text-gray-400">
                MERN Stack Developer focused on interactive products,
                AI-powered systems, and cinematic web experiences.
              </p>
              <div className="mt-10 flex gap-6">
                <MagneticButton strength={0.2}>
                  <button className="rounded-full border border-[#00ffae]/20 bg-[#00ffae]/10 px-8 py-4 text-sm font-medium tracking-wide text-[#00ffae] backdrop-blur-md transition-colors duration-300 hover:bg-[#00ffae]/20">
                    View Projects
                  </button>
                </MagneticButton>

                <MagneticButton strength={0.2}>
                  <button className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-white/10">
                    Download Resume
                  </button>
                </MagneticButton>
              </div>
              <div className="h-[200vh]" />
            </div>
          </section>
        </Container>
      </div>  
    </main>
  );
}