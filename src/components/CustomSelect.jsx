import { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ options, value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 dark:bg-stone-950 border border-slate-200 dark:border-stone-800 rounded-2xl px-5 py-4 font-bold flex items-center justify-between transition-all hover:border-emerald-300 dark:hover:border-stone-600 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 focus:border-emerald-400 dark:focus:border-emerald-500 text-slate-800 dark:text-stone-200 shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-3 truncate">
          {selectedOption && (
             <span 
               className={`shrink-0 w-3.5 h-3.5 rounded-full bg-gradient-to-br ${selectedOption.textGradient} shadow-sm border border-black/5 dark:border-white/10`} 
             />
          )}
          <span className="truncate">{selectedOption ? selectedOption.name.replace('Mojito ', '') : label}</span>
        </div>
        <svg className={`shrink-0 fill-current h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-stone-900 border border-slate-100 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in-down origin-top">
          <ul className="max-h-60 overflow-y-auto custom-scrollbar py-2">
            {options.map((option) => (
              <li 
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`px-5 py-3.5 cursor-pointer text-sm font-bold transition-colors flex items-center gap-3 ${value === option.id ? 'bg-emerald-50 dark:bg-stone-800 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-stone-300 hover:bg-slate-50 dark:hover:bg-stone-800/80 hover:text-slate-800 dark:hover:text-white'}`}
              >
                <span 
                   className={`shrink-0 w-3.5 h-3.5 rounded-full bg-gradient-to-br ${option.textGradient} shadow-sm border border-black/5 dark:border-white/10`} 
                />
                {option.name.replace('Mojito ', '')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
