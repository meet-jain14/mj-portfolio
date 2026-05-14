import Container from "../components/Container";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
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
            <div className="h-[200vh]" />
          </div>
        </section>
      </Container>
    </main>
  );
}