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
        <nav className="mt-6 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-8 md:px-10 py-4 backdrop-blur-md">
          <div>
            <h1 className="text-sm font-medium tracking-[0.3em] text-[#00ffae]">
              MJ
            </h1>
          </div>

          <ul className="hidden gap-8 md:flex">
            {navItems.map((item) => (
              <li
                key={item}
                className="cursor-pointer text-sm text-gray-300 transition-colors duration-300 hover:text-white"
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}