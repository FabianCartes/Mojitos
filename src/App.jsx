import { useState, useEffect, useRef, useMemo } from 'react';
import { mojitosData } from './data';
import MojitoCard from './components/MojitoCard';
import Cart from './components/Cart';
import Mixology from './components/Mixology';
import Promos from './components/Promos';

const LeafDivider = () => {
  // Generamos hojas usando vectores SVG puros para que no dependa de los emojis del sistema operativo
  const { leaves, particles } = useMemo(() => {
    const leavesArr = [];
    const colors = ['#16a34a', '#15803d', '#22c55e', '#4ade80', '#065f46'];
    for (let i = 0; i < 200; i++) {
      // Distribuimos a lo largo del ancho
      const x = (i * 0.55) - 5 + (Math.random() * 2 - 1); 
      
      // Ondas para efecto de enredadera colgante
      const wave = Math.sin(x / 8) * 15 + Math.cos(x / 4) * 10; 
      
      // Hacemos que la densidad sea mayor arriba y caigan algunas hacia abajo
      const depth = Math.pow(Math.random(), 2) * 50; 
      
      const y = wave + depth - 30; // Posición vertical

      const rotate = Math.random() * 360;
      const scale = 0.5 + Math.random() * 1.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      leavesArr.push({ x, y, rotate, scale, color });
    }

    const particlesArr = [];
    for (let i = 0; i < 40; i++) {
      particlesArr.push({
        x: Math.random() * 100,
        y: Math.random() * 30 - 10,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 5,
        size: 3 + Math.random() * 5,
        opacity: 0.3 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    return { leaves: leavesArr, particles: particlesArr };
  }, []);

  return (
    <div className="w-full h-16 md:h-20 pointer-events-none relative z-20 my-[-1rem] drop-shadow-md opacity-95 dark:opacity-80">
      {/* Partículas cayendo */}
      {particles.map((p, i) => (
        <div 
          key={`p-${i}`}
          className="absolute rounded-full animate-falling"
          style={{
            left: `${p.x}%`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--particle-opacity': p.opacity
          }}
        />
      ))}

      {/* Hojas estáticas */}
      {leaves.map((leaf, i) => (
        <svg 
          key={`l-${i}`}
          className="absolute"
          width="30" height="30" viewBox="0 0 24 30"
          style={{
            left: `${leaf.x}%`,
            top: `${leaf.y}px`,
            transform: `rotate(${leaf.rotate}deg) scale(${leaf.scale})`,
            color: leaf.color,
            fill: 'currentColor',
            // Añadimos una sutil sombra individual a cada hoja
            filter: 'drop-shadow(0px 4px 3px rgba(0,0,0,0.15))'
          }}
        >
          {/* Forma de hoja tropical (tipo pothos/corazón) */}
          <path d="M 12 24 C 12 24 0 16 0 8 C 0 2 6 -2 12 4 C 18 -2 24 2 24 8 C 24 16 12 24 12 24 Z" />
          {/* Nervadura central */}
          <path d="M 12 24 Q 10 14 12 4" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" fill="none" />
          {/* Tallo */}
          <path d="M 12 24 Q 14 27 13 30" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      ))}
    </div>
  );
};

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [showToast, setShowToast] = useState(false);
  const [jumpCart, setJumpCart] = useState(false);
  const toastTimerRef = useRef(null);
  const jumpTimerRef = useRef(null);

  // Dark Mode State defaults to false to force Light Mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleAddToCart = (item) => {
    setCart((prev) => [...prev, item]);
    
    setShowToast(true);
    setJumpCart(true);
    
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
    
    toastTimerRef.current = setTimeout(() => setShowToast(false), 2500);
    jumpTimerRef.current = setTimeout(() => setJumpCart(false), 400);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-emerald-200 dark:selection:bg-emerald-500/30 transition-colors duration-300 relative overflow-x-hidden">
      {/* Elementos Decorativos: Hojas y Monito */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          opacity: Math.max(0, 1 - scrollY / 600)
        }}
      >
        {/* Hojas en las esquinas (Usando emojis con filtros para que parezcan marcas de agua sutiles) */}
        <div className="absolute -top-16 -left-16 text-[15rem] md:text-[25rem] opacity-[0.03] dark:opacity-[0.02] -rotate-45 select-none grayscale-[50%] sepia-[30%] hue-rotate-[-20deg] drop-shadow-2xl">
          🌴
        </div>
        <div className="absolute top-[20%] -right-24 text-[12rem] md:text-[20rem] opacity-[0.03] dark:opacity-[0.02] rotate-[130deg] select-none grayscale-[50%] sepia-[30%] hue-rotate-[-20deg] drop-shadow-2xl">
          🌿
        </div>
        <div className="absolute -bottom-16 -left-20 text-[18rem] md:text-[28rem] opacity-[0.03] dark:opacity-[0.02] rotate-45 select-none grayscale-[50%] sepia-[30%] hue-rotate-[-20deg] drop-shadow-2xl">
          🍃
        </div>
        <div className="absolute -bottom-24 -right-16 text-[16rem] md:text-[26rem] opacity-[0.03] dark:opacity-[0.02] -rotate-[10deg] select-none grayscale-[50%] sepia-[30%] hue-rotate-[-20deg] drop-shadow-2xl">
          🌿
        </div>
        
        {/* Monito Background Centrado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/Logos/Monito.png" 
            alt="Monito Background" 
            className="w-[120vw] sm:w-[80vw] md:w-[60vw] lg:w-[40vw] max-w-2xl h-auto object-contain opacity-[0.07] dark:opacity-[0.03] grayscale-[20%]"
          />
        </div>
      </div>

      {/* Menu Lateral Ovelay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Menu Lateral (Drawer) */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#f6faeb] dark:bg-[#141c0e] z-[70] shadow-2xl transition-transform duration-300 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 dark:border-[#1e2915] flex items-center justify-between">
          <h2 className="text-xl font-black text-emerald-700 dark:text-emerald-400">Navegación</h2>
          <button onClick={() => setIsMenuOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 bg-slate-100 dark:bg-stone-800">
            x
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <button onClick={() => scrollTo("catalogo")} className="text-left text-lg font-bold text-slate-700 dark:text-stone-300 hover:text-emerald-500">🍹 Catálogo Clásico</button>
          <button onClick={() => scrollTo("especiales")} className="text-left text-lg font-bold text-slate-700 dark:text-stone-300 hover:text-purple-500">🌟 Especiales</button>
          <button onClick={() => scrollTo("promociones")} className="text-left text-lg font-bold text-slate-700 dark:text-stone-300 hover:text-orange-500">🔥 Promociones</button>
          <button onClick={() => scrollTo("mixologia")} className="text-left text-lg font-bold text-slate-700 dark:text-stone-300 hover:text-purple-500">🌈 Mixología: Match</button>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f6faeb]/80 dark:bg-[#141c0e]/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-[#1e2915] shadow-sm dark:shadow-none py-4 transition-colors duration-300">
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
              className={`cursor-pointer relative p-3 rounded-full border transition-all duration-300 group
                ${cart.length > 0 && !jumpCart ? 'animate-bounce border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-stone-800 shadow-md hover:border-emerald-500 hover:bg-emerald-100' : ''}
                ${cart.length === 0 && !jumpCart ? 'border-slate-200 dark:border-stone-800 bg-slate-50 dark:bg-stone-900 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-stone-800' : ''}
                ${jumpCart ? 'scale-[1.3] -translate-y-4 rotate-[15deg] shadow-xl bg-emerald-200 dark:bg-emerald-800 border-emerald-500' : ''}
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-700 dark:text-stone-300 transition-colors group-hover:text-emerald-600">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              {cart.length > 0 && (
                <span className={`absolute -top-2 -right-2 bg-rose-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-stone-950 shadow-md transition-all ${jumpCart ? 'scale-125 bg-amber-500' : ''}`}>
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <LeafDivider />

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

      {/* Catalog Grid (Clásicos) */}
      <main id="catalogo" className="container mx-auto px-4 pb-12 relative z-10">
        <div className="flex items-center justify-center mb-12">
          <h3 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white relative transition-colors duration-300">
            Nuestro Menú Tropical
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full opacity-50"></span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mojitosData.filter(m => !['bosque', 'caribe'].includes(m.id)).map((mojito) => (
            <MojitoCard 
              key={mojito.id} 
              mojito={mojito} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      </main>

      <LeafDivider />

      {/* Especiales Section */}
      <section id="especiales" className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex items-center justify-center mb-12">
          <h3 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white relative transition-colors duration-300">
            Especiales
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full opacity-50"></span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {mojitosData.filter(m => ['bosque', 'caribe'].includes(m.id)).map((mojito) => (
            <MojitoCard 
              key={mojito.id} 
              mojito={mojito} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      </section>

      <LeafDivider />

      {/* Promociones Section */}
      <Promos onAddToCart={handleAddToCart} />

      <LeafDivider />

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

      {/* Toast Notification */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-emerald-600 dark:bg-emerald-500 text-white font-bold rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2 pointer-events-none origin-bottom
        ${showToast ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'}
        `}
      >
        <span className="text-xl">🛒</span> 
        ¡Agregado al carrito!
      </div>
    </div>
  );
}

export default App;
