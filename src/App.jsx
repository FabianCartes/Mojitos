import { useState, useEffect } from 'react';
import { mojitosData } from './data';
import MojitoCard from './components/MojitoCard';
import Cart from './components/Cart';
import Mixology from './components/Mixology';
import Promos from './components/Promos';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dark Mode State defaults to false to force Light Mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleAddToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-emerald-200 dark:selection:bg-emerald-500/30 transition-colors duration-300">
      {/* Menu Lateral Ovelay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Menu Lateral (Drawer) */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-stone-950 z-[70] shadow-2xl transition-transform duration-300 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 dark:border-stone-800 flex items-center justify-between">
          <h2 className="text-xl font-black text-emerald-700 dark:text-emerald-400">Navegación</h2>
          <button onClick={() => setIsMenuOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 bg-slate-100 dark:bg-stone-800">
            x
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <button onClick={() => scrollTo("catalogo")} className="text-left text-lg font-bold text-slate-700 dark:text-stone-300 hover:text-emerald-500">🍹 Catálogo Clásico</button>
          <button onClick={() => scrollTo("promociones")} className="text-left text-lg font-bold text-slate-700 dark:text-stone-300 hover:text-orange-500">🔥 Promociones</button>
          <button onClick={() => scrollTo("mixologia")} className="text-left text-lg font-bold text-slate-700 dark:text-stone-300 hover:text-purple-500">🌈 Mixología: Match</button>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-stone-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-stone-800 shadow-sm dark:shadow-none py-4 transition-colors duration-300">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             {/* Hamburger Button */}
             <button 
               onClick={() => setIsMenuOpen(true)}
               className="p-2 mr-1 rounded-xl bg-slate-50 dark:bg-stone-900 border border-slate-200 dark:border-stone-800 text-slate-600 dark:text-stone-400 hover:bg-slate-100 transition-colors cursor-pointer"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
             </button>

             <img src="/Logos/Monito.png" alt="Logo de Mojitos Yungay" className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-md" />
             <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-lime-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
               Mojitos Yungay
             </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="cursor-pointer p-3 rounded-full bg-slate-50 dark:bg-stone-900 border border-slate-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-stone-700 hover:bg-emerald-50 dark:hover:bg-stone-800 transition-colors"
              title="Alternar Modo Oscuro"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="cursor-pointer relative p-3 rounded-full bg-slate-50 dark:bg-stone-900 border border-slate-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-stone-700 hover:bg-emerald-50 dark:hover:bg-stone-800 transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-700 dark:text-stone-300 transition-colors group-hover:text-emerald-500">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-stone-950 shadow-md">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-emerald-300/20 to-yellow-300/20 dark:from-emerald-500/10 dark:to-cyan-500/10 blur-[120px] rounded-full pointer-events-none transition-all duration-700" />
        
        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <div className="inline-block px-4 py-1.5 bg-white/70 dark:bg-stone-900/50 backdrop-blur border border-emerald-100 dark:border-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-6 shadow-sm transition-colors duration-300">
            🌴 100% Frescura Garantizada
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-800 dark:text-white drop-shadow-sm transition-colors duration-300">
            Refresca tu <br />
            <span className="bg-gradient-to-r from-emerald-500 to-lime-500 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
              Momento Perfecto
            </span>
          </h2>
          <p className="text-slate-600 dark:text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium transition-colors duration-300">
            Mojitos artesanales hechos con ingredientes frescos y premium. 
            Elige tu sabor favorito, ajusta tu punto de alcohol y disfruta del verdadero sabor del verano.
          </p>
        </div>
      </section>

      {/* Catalog Grid */}
      <main id="catalogo" className="container mx-auto px-4 pb-24 relative z-10">
        <div className="flex items-center justify-center mb-12">
          <h3 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white relative transition-colors duration-300">
            Nuestro Menú Tropical
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full opacity-50"></span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mojitosData.map((mojito) => (
            <MojitoCard 
              key={mojito.id} 
              mojito={mojito} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      </main>

      {/* Promociones Section */}
      <Promos onAddToCart={handleAddToCart} />

      {/* Mixology Section */}
      <div id="mixologia">
        <Mixology onAddToCart={handleAddToCart} />
      </div>

      {/* Cart Panel */}
      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
      />
    </div>
  );
}

export default App;
