import { useState, useMemo } from 'react';
import CustomSelect from './CustomSelect';
import { mojitosData, alcoholLevels } from '../data';

export default function Mixology({ onAddToCart }) {
  const mixableFlavors = mojitosData.filter(m => m.id !== 'tradicional');
  
  const [flavor1, setFlavor1] = useState(mixableFlavors[1]); // Frambuesa
  const [flavor2, setFlavor2] = useState(mixableFlavors[3]); // Mango
  const [selectedAlcohol, setSelectedAlcohol] = useState(alcoholLevels[2]); // Normal

  const basePrice = 8500;
  const currentPrice = basePrice + selectedAlcohol.modifier;

  const gradientStyle = useMemo(() => {
    const color1 = flavor1.textGradient.split(' ')[0];
    const color2 = flavor2.textGradient.split(' ')[1];
    return `${color1} ${color2}`;
  }, [flavor1, flavor2]);

  const handleAdd = () => {
    onAddToCart({
      id: `mix-${flavor1.id}-${flavor2.id}`,
      name: `Mix: ${flavor1.name.replace('Mojito ', '')} & ${flavor2.name.replace('Mojito ', '')}`,
      description: 'Combinación personalizada de sabores vibrantes y tropicales.',
      price: basePrice,
      finalPrice: currentPrice,
      alcoholLevel: selectedAlcohol,
      image: flavor1.image,
      cartId: `mix-${flavor1.id}-${flavor2.id}-${selectedAlcohol.id}-${Date.now()}`
    });
  };

  return (
    <section className="py-24 border-t border-slate-100 dark:border-stone-800 bg-white dark:bg-stone-950 relative overflow-hidden transition-colors duration-300">
      {/* Decorative tropical elements */}
      <div className={`absolute top-1/2 left-1/4 w-96 h-96 blur-[120px] dark:blur-[120px] rounded-full opacity-20 dark:opacity-20 pointer-events-none bg-gradient-to-r ${flavor1.textGradient}`} />
      <div className={`absolute top-1/2 right-1/4 w-96 h-96 blur-[120px] dark:blur-[120px] rounded-full opacity-20 dark:opacity-20 pointer-events-none bg-gradient-to-r ${flavor2.textGradient}`} />

      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        <h3 className="text-4xl md:text-5xl font-black mb-6 text-slate-800 dark:text-white transition-colors duration-300">
          <span className={`bg-gradient-to-r ${gradientStyle} bg-clip-text text-transparent transition-colors duration-500`}>Crea tu Match</span>
        </h3>
        <p className="text-slate-600 dark:text-stone-400 text-lg mb-12 font-medium transition-colors duration-300">
          ¿No te decides por un solo sabor? Mezcla dos de tus sabores favoritos frutales y crea una experiencia única y explosiva.
        </p>

        <div className="bg-white dark:bg-stone-900/90 backdrop-blur-xl border border-slate-200 dark:border-stone-800 rounded-[2.5rem] p-6 md:p-10 shadow-xl dark:shadow-2xl relative transition-colors duration-300">
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-10">
            {/* Flavor 1 */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-black text-slate-400 dark:text-stone-500 uppercase tracking-wide transition-colors">Sabor Uno</label>
              <div className="relative z-20">
                <CustomSelect
                  options={mixableFlavors}
                  value={flavor1.id}
                  onChange={(id) => setFlavor1(mixableFlavors.find(f => f.id === id))}
                  label="Eige el Sabor Uno"
                />
              </div>
            </div>

            {/* Plus sign */}
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-lime-100 dark:from-stone-800 dark:to-stone-800 text-emerald-600 dark:text-stone-400 font-black text-3xl border-4 border-white dark:border-stone-900 shadow-xl z-10 md:-mx-5 pb-1 transition-colors duration-300">
              +
            </div>

            {/* Flavor 2 */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-black text-slate-400 dark:text-stone-500 uppercase tracking-wide transition-colors">Sabor Dos</label>
              <div className="relative z-10">
                <CustomSelect
                  options={mixableFlavors}
                  value={flavor2.id}
                  onChange={(id) => setFlavor2(mixableFlavors.find(f => f.id === id))}
                  label="Elige el Sabor Dos"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-stone-800 pt-8 flex flex-col items-center justify-center gap-8 md:flex-row md:justify-between transition-colors duration-300">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-sm font-black text-slate-400 dark:text-stone-500 uppercase tracking-wide">Línea:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {alcoholLevels.map(level => (
                  <button
                    key={`mix-${level.id}`}
                    onClick={() => setSelectedAlcohol(level)}
                    className={`px-4 py-2 text-sm rounded-full border transition-all cursor-pointer ${
                      selectedAlcohol.id === level.id
                        ? `bg-slate-800 dark:bg-stone-200 border-slate-800 dark:border-white text-white dark:text-stone-900 font-bold shadow-md dark:shadow-lg`
                        : "border-slate-200 dark:border-stone-700 text-slate-500 dark:text-stone-300 hover:border-slate-300 dark:hover:border-stone-500 hover:bg-slate-50 dark:hover:bg-stone-800 bg-white dark:bg-stone-950"
                    }`}
                  >
                    {level.label} {level.modifier > 0 && `(+${level.modifier})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-3xl font-black text-slate-800 dark:text-white transition-colors duration-300">
                ${currentPrice.toLocaleString("es-CL")}
              </span>
              <button
                onClick={handleAdd}
                className={`px-8 py-4 rounded-full font-black text-white text-lg shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform hover:-translate-y-1 active:scale-95 bg-gradient-to-r ${gradientStyle} hover:brightness-105 cursor-pointer`}
              >
                Sumar Mix
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
