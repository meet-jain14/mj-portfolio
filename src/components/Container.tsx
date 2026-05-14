type Props = {
  children: React.ReactNode;
};

export default function Container({ children }: Props) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-6 md:px-8 lg:px-10">
      {children}
    </div>
  );
}