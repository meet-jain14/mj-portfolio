type Props = {
  category: string;
  title: string;
  description: string;
  stack: string[];
  accent?: string;
  preview?: string;
};

export default function ProjectCard({
  category,
  title,
  description,
  stack,
  preview,
  accent = "#00ffae",
}: Props) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[36px]
        border
        border-white/10
        bg-white/[0.03]
        p-8
        md:p-10
        backdrop-blur-xl
        transition-all
        duration-700
        hover:border-white/20
        hover:bg-white/[0.05]
        hover:scale-[1.01]"
    >

      {/* Ambient glow */}
      <div
        className="
            absolute
            inset-0
            opacity-0
            transition-opacity
            duration-700
            group-hover:opacity-100
          "
      >
        {/* Left glow */}
        <div
          className="
              absolute
              -left-24
              top-0
              h-64
              w-64
              rounded-full
              style={{
                backgroundColor: `${accent}20`,
              }}
              blur-3xl
            "
        />

        {/* Right glow */}
        <div
          className="
              absolute
              right-[-10%]
              top-[20%]
              h-72
              w-72
              rounded-full
              style={{
                backgroundColor: `${accent}10`,
              }}
              blur-3xl
            "
        />
      </div>

      <div
        className="
            relative
            z-10
            gap-10
            lg:grid-cols-[1.1fr_0.9fr]
            items-center
            transition-transform
            duration-700
            group-hover:translate-y-[-4px]
          "
      >
        <div>
          <p className="text-sm uppercase tracking-[0.3em] style={{ color: accent }}">
            {category}
          </p>

          <h3 className="mt-6 text-3xl font-bold leading-tight tracking-[-0.03em]">
            {title}
          </h3>

          <p className="mt-6 max-w-2xl text-gray-400 leading-relaxed">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {stack.map((tech) => (
              <div
                key={tech}
                className="
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-4
                  py-2
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  text-gray-300
                  transition-all
                  duration-500
                  group-hover:border-[#00ffae]/20
                  group-hover:text-white
                "
              >
                {tech}
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3 text-sm text-white/70 transition-all duration-500 group-hover:text-white">
            <span>View Project</span>

            <span className="transition-transform duration-500 group-hover:translate-x-3">
              →
            </span>
          </div>
        </div>
        {/* Preview Panel */}
        <div
          className="
            relative
            hidden
            h-full
            min-h-[280px]
            overflow-hidden
            rounded-[28px]
            border
            border-white/10
            bg-white/[0.03]
            lg:block
          "
        >
          {/* Atmospheric overlay */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-[#00ffae]/10
              via-transparent
              to-transparent
              opacity-60
            "
          />

          {/* Placeholder content */}
          {/* Floating ambient orbs */}
          <div
            className="
              absolute
              left-[10%]
              top-[20%]
              h-24
              w-24
              rounded-full
              bg-[#00ffae]/10
              blur-3xl
              transition-all
              duration-1000
              group-hover:translate-x-6
              group-hover:translate-y-2
            "
          />

          <div
            className="
              absolute
              bottom-[10%]
              right-[15%]
              h-32
              w-32
              rounded-full
              bg-white/[0.05]
              blur-3xl
              transition-all
              duration-1000
              group-hover:-translate-x-4
              group-hover:-translate-y-3
            "
          />

          {/* Grid overlay */}
          <div
            className="
              absolute
              inset-0
              opacity-[0.06]
              [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)]
              [background-size:40px_40px]
            "
          />

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p
              className="
                text-sm
                uppercase
                tracking-[0.3em]
                text-white/30
                transition-all
                duration-700
                group-hover:text-white/50
              "
            >
              Live Experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
