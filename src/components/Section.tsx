type Props = {
    id?: string;
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
  };
  
  export default function Section({
    id,
    title,
    subtitle,
    children,
  }: Props) {
    return (
      <section
        id={id}
        className="relative py-32 md:py-40"
      >
        <div className="mb-16">
          {subtitle && (
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#00ffae]">
              {subtitle}
            </p>
          )}
  
          {title && (
            <h2 className="max-w-4xl text-4xl font-bold leading-[0.95] tracking-[-0.04em] md:text-6xl">
              {title}
            </h2>
          )}
        </div>
  
        {children}
      </section>
    );
  }