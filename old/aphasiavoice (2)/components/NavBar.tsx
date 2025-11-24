import React from 'react';

interface NavBarProps {
  currentPage: number;
  pageCount: number;
  setPage: (pageIndex: number) => void;
  isDevMode: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ currentPage, pageCount, setPage, isDevMode }) => {
  // Generate array [0, 1, 2...] up to pageCount
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <div className="flex flex-col w-full bg-slate-900 border-t border-slate-800 safe-area-bottom z-30 pt-2 px-2 pb-3">
      <nav className="h-20 flex flex-row gap-2 shrink-0 relative justify-center items-center">
        {pages.map((pageIndex) => {
          const isActive = currentPage === pageIndex;
          return (
            <button
              key={pageIndex}
              onClick={() => setPage(pageIndex)}
              className={`
                flex-1 h-14 max-w-[100px]
                rounded-xl
                flex items-center justify-center
                transition-all duration-150
                font-bold text-2xl
                relative
                ${isActive 
                  ? 'bg-slate-950 text-sky-400 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.6)] translate-y-1 border border-slate-800/50' 
                  : 'bg-slate-800 text-slate-400 shadow-[0px_4px_0px_rgb(15,23,42)] hover:bg-slate-700 hover:text-slate-200 -translate-y-0 mb-1 border-t border-white/5'}
              `}
            >
              {pageIndex + 1}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default NavBar;