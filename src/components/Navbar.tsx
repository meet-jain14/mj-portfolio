import Container from "./Container";

const navItems = [
  "About",
  "Projects",
  "Certifications",
  "Resume",
  "Contact",
];

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <Container>
        <nav className="mt-6 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 backdrop-blur-xl md:px-10">
          
          <div>
            <h1 className="text-sm font-medium tracking-[0.3em] text-[#00ffae]">
              MJ
            </h1>
          </div>

          <ul className="hidden gap-8 md:flex">
            {navItems.map((item) => (
              <li
                key={item}
                className="
                  group
                  relative
                  cursor-pointer
                  text-sm
                  text-gray-400
                  transition-all
                  duration-500
                  hover:text-white
                "
              >
                <span className="relative z-10">
                  {item}
                </span>

                <span
                  className="
                    absolute
                    inset-0
                    rounded-full
                    bg-[#00ffae]/0
                    blur-xl
                    transition-all
                    duration-500
                    group-hover:bg-[#00ffae]/10
                  "
                />
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}