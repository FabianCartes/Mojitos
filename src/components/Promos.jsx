import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { mojitosData, alcoholLevels } from "../data";
import CustomSelect from "./CustomSelect";

export default function Promos({ onAddToCart }) {
  const [activePromo, setActivePromo] = useState(null);
  const [promoItems, setPromoItems] = useState([]); // Array de obj: { flavorId, alcohol }

  const promoList = [
    {
      id: "promo-duo",
      name: "Dúo Degustación",
      tagline: "El más vendido (+ Envío) 🔥",
      description: "2 Litros (sabores a elección). La gente rara vez toma sola un fin de semana. No te conformes con uno solo.",
      oldPrice: 17000,
      price: 16000,
      isFreeDelivery: false,
      gradient: "from-blue-500 to-indigo-600",
      flavorCount: 2,
    },
    {
      id: "promo-trio",
      name: "Trío La Previa",
      tagline: "¡ENVÍO GRATIS! 🛵",
      description: "3 Litros a elección. El gancho perfecto: te llevas el frasco extra, aseguras la sesión y te saltas el costo de despacho.",
      oldPrice: 27500,
      price: 25000,
      isFreeDelivery: true,
      gradient: "from-amber-500 to-orange-500",
      flavorCount: 3,
    },
    {
      id: "promo-color",
      name: "Full Color Pack",
      tagline: "¡ENVÍO GRATIS! 🌈",
      description: "Los 5 Litros (idealmente el arcoíris, pero tú decides los sabores). La barra completa en tu casa para una noche espectacular.",
      oldPrice: 44500,
      price: 40000,
      isFreeDelivery: true,
      gradient: "from-rose-500 to-pink-600",
      flavorCount: 5,
    }
  ];

  const handleOpenPromo = (promo) => {
    setActivePromo(promo);
    
    // Set default values based on flavor count
    let defaultFlavors = [];
    if (promo.id === "promo-duo") defaultFlavors = ["tradicional", "maracuya"];
    else if (promo.id === "promo-trio") defaultFlavors = ["tradicional", "frutilla", "caribe"];
    else if (promo.id === "promo-color") defaultFlavors = ["tradicional", "frutilla", "maracuya", "caribe", "bosque"];
    else defaultFlavors = Array(promo.flavorCount).fill("tradicional");

    // Construimos la estructura anidada con alcohol normal por defecto a cada vaso
    setPromoItems(defaultFlavors.map(fId => ({ 
      flavorId: fId, 
      alcohol: alcoholLevels[2] 
    })));
  };

  const handleClosePromo = () => {
    setActivePromo(null);
  };

  const updateFlavor = (index, flavorId) => {
    const newItems = [...promoItems];
    newItems[index].flavorId = flavorId;
    setPromoItems(newItems);
  };

  const updateAlcohol = (index, alcoholObj) => {
    const newItems = [...promoItems];
    newItems[index].alcohol = alcoholObj;
    setPromoItems(newItems);
  };

  const handleConfirmOrder = () => {
    const customString = promoItems.map(item => {
      const flavorName = mojitosData.find(m => m.id === item.flavorId).name.replace('Mojito ', '');
      return `${flavorName} (${item.alcohol.label})`;
    }).join(' + ');

    onAddToCart({
      id: activePromo.id,
      name: activePromo.name,
      description: `Sabores: ${customString}`,
      finalPrice: activePromo.price,
      isFreeDelivery: activePromo.isFreeDelivery,
      alcoholLevel: { label: "Mix Creado", modifier: 0 },
      image: "/Logos/Monito.png", 
      textGradient: activePromo.gradient,
      cartId: `${activePromo.id}-${Date.now()}`
    });
    handleClosePromo();
  };

  // Prevenir background scroll
  useEffect(() => {
    if (activePromo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; }
  }, [activePromo]);

  return (
    <section id="promociones" className="py-24 bg-slate-50 dark:bg-stone-950 border-t border-slate-100 dark:border-stone-800 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center max-w-6xl">
        
        <h3 className="text-4xl md:text-5xl font-black mb-4 text-slate-800 dark:text-white transition-colors duration-300">
          Super <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Promos</span>
        </h3>
        <p className="text-slate-600 dark:text-stone-400 text-lg md:text-xl mb-14 font-medium transition-colors duration-300 max-w-2xl mx-auto">
          ¿Para qué quedarse con las ganas? Aprovecha estos packs ideales para previas, carretes grandes o para darle con todo el fin de semana.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promoList.map((promo) => (
            <div 
              key={promo.id} 
              className="relative flex flex-col bg-white dark:bg-stone-900 border-2 border-slate-100 dark:border-stone-800 rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left"
            >
              <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full opacity-10 bg-gradient-to-br blur-3xl from-slate-400 to-slate-600 pointer-events-none" />
              
              <div className="z-10 relative flex-1 flex flex-col">
                <div className={`self-start px-4 py-1.5 rounded-full text-sm font-black text-white mb-6 shadow-md bg-gradient-to-r ${promo.gradient}`}>
                  {promo.tagline}
                </div>
                
                <h4 className="text-3xl font-black text-slate-800 dark:text-white mb-3">{promo.name}</h4>
                <p className="text-slate-600 dark:text-stone-400 text-base font-medium mb-8 flex-1 leading-relaxed">
                  {promo.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-400 line-through decoration-slate-300 dark:decoration-stone-600">
                    Suelto: ${promo.oldPrice.toLocaleString("es-CL")}
                  </span>
                </div>

                <div className="flex items-end justify-between mt-auto">
                   <div className="text-4xl font-black text-slate-800 dark:text-white">
                      ${promo.price.toLocaleString("es-CL")}
                   </div>
                   <button
                     onClick={() => handleOpenPromo(promo)}
                     className={`cursor-pointer w-14 h-14 rounded-full flex items-center justify-center font-black text-white shadow-lg transition-transform transform active:scale-95 hover:scale-105 bg-gradient-to-r ${promo.gradient} hover:brightness-105`}
                     title="Añadir a la promo"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                   </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL CONFIGURADOR DE LA PROMO            */}
      {/* ========================================= */}
      {activePromo && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex justify-center items-center p-4 sm:p-6"
          onClick={handleClosePromo}
        >
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-fade-in" />
          
          <div 
            className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-[2rem] shadow-2xl animate-modal-pop max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8 flex-shrink-0 border-b border-slate-100 dark:border-stone-800">
               <button 
                onClick={handleClosePromo}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 dark:bg-stone-800 text-slate-500 dark:text-stone-400 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors z-[110] cursor-pointer"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
               </button>
               <h3 className={`text-3xl font-black bg-gradient-to-r ${activePromo.gradient} bg-clip-text text-transparent pr-12`}>
                 Configurar {activePromo.name}
               </h3>
               <p className="text-slate-500 dark:text-stone-400 mt-2 font-medium">
                 {activePromo.id === "promo-color" ? "Selecciona el arcoíris perfecto a tu gusto:" : "Agrega el nivel de alcohol independiente a cada uno de tus vasos:"}
               </p>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 pb-32"> 
               <div className="flex flex-col gap-8">
                {promoItems.map((item, index) => (
                  <div key={index} className="relative pb-6 border-b border-slate-100 dark:border-stone-800/60 last:border-0 last:pb-0" style={{ zIndex: 50 - index }}>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3 gap-3">
                      <label className="block text-xs font-black text-slate-400 dark:text-stone-500 uppercase ml-1">Mojito {index + 1}</label>
                      <div className="flex bg-slate-100 dark:bg-stone-800/80 rounded-lg p-1 self-start sm:self-auto">
                         {alcoholLevels.map(level => (
                           <button
                             key={`p-${index}-${level.id}`}
                             onClick={() => updateAlcohol(index, level)}
                             className={`px-3 py-1 text-[11px] uppercase tracking-wider font-extrabold rounded-md transition-all ${item.alcohol.id === level.id ? 'bg-white dark:bg-stone-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400 dark:text-stone-500 hover:text-slate-600 dark:hover:text-stone-300'}`}
                           >
                             {level.label}
                           </button>
                         ))}
                      </div>
                    </div>
                    
                    <CustomSelect 
                      options={mojitosData}
                      value={item.flavorId}
                      onChange={(newId) => updateFlavor(index, newId)}
                      label={`Selecciona el sabor ${index + 1}`}
                    />
                  </div>
                ))}
               </div>
            </div>

            <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex justify-between items-center gap-4 z-[100] mt-auto">
               <div className="flex flex-col">
                 <span className="text-xs font-bold text-slate-400 uppercase mb-0.5 tracking-wide">Total Pack</span>
                 <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-none">
                   ${activePromo.price.toLocaleString("es-CL")}
                 </span>
               </div>
               <button
                  onClick={handleConfirmOrder}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-white text-sm shadow-md cursor-pointer transition-transform transform active:scale-95 hover:scale-105 bg-gradient-to-r ${activePromo.gradient} hover:brightness-105`}
                >
                  Agregar a Pedido
               </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </section>
  );
}
