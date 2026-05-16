type Props = {
    category: string;
    title: string;
    description: string;
  };
  
  export default function ProjectCard({
    category,
    title,
    description,
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
          p-8 md:p-10
          transition-all
          duration-700
          hover:border-[#00ffae]/20
          hover:bg-white/[0.05]
          backdrop-blur-xl
        "
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
          <div
            className="
              absolute
              -left-24
              top-0
              h-64
              w-64
              rounded-full
              bg-[#00ffae]/10
              blur-3xl
            "
          />
        </div>
  
        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[#00ffae]">
            {category}
          </p>
  
          <h3 className="mt-6 text-3xl font-bold leading-tight tracking-[-0.03em]">
            {title}
          </h3>
  
          <p className="mt-6 max-w-2xl text-gray-400 leading-relaxed">
            {description}
          </p>
  
          <div className="mt-10 flex items-center gap-3 text-sm text-white/70 transition-all duration-500 group-hover:text-white">
            <span>View Project</span>
  
            <span className="transition-transform duration-500 group-hover:translate-x-2">
              →
            </span>
          </div>
        </div>
      </div>
    );
  }