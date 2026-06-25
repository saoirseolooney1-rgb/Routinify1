import { FC } from "react";

export const SiteHeader: FC = () => {
  return (
    <header className="w-full pt-8 pb-6 px-6 bg-white/50 backdrop-blur-sm border-b border-teal-100 flex flex-col items-center sticky top-0 z-40">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-sky-600 tracking-tight" style={{ fontFamily: 'Fraunces, serif' }}>
        routinify
      </h1>
      <p className="text-teal-800/70 mt-2 text-sm md:text-base font-medium uppercase tracking-widest">
        Classroom Operations Dashboard
      </p>
    </header>
  );
};
