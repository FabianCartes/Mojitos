import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { alcoholLevels } from "../data";

export default function MojitoCard({ mojito, onAddToCart }) {
  const [selectedAlcohol, setSelectedAlcohol] = useState(alcoholLevels[2]); // Default: Normal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPrice = mojito.price + selectedAlcohol.modifier;

  // Añadir al carrito
  const handleAdd = () => {
    onAddToCart({
      ...mojito,
      alcoholLevel: selectedAlcohol,
      finalPrice: currentPrice,
      quantity: 1,
      cartId: `${mojito.id}-${selectedAlcohol.id}-${Date.now()}` // ID Único
    });
    handleCloseModal();
  };

  // Cierre ordenado para limpiar historial (y permitir botón de "Atrás" de Android/iOS)
  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (window.history.state && window.history.state.modal === mojito.id) {
      window.history.back();
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    window.history.pushState({ modal: mojito.id }, "");
  };

  // Prevenir scroll de fondo y manejar teclas/atrás
  useEffect(() => {
    if (!isModalOpen) return;
    
    document.body.style.overflow = "hidden";

    const handlePopState = () => {
      setIsModalOpen(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleCloseModal();
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  return (
    <>
      {/* ================================================== */}
      {/* TARJETA NORMAL (Cátalogo Principal)                  */}
      {/* ================================================== */}
      <div className={`relative flex flex-col group rounded-[2.5rem] p-6 bg-white dark:bg-stone-900/80 backdrop-blur-xl border-2 border-slate-100 dark:border-stone-800 transition-all duration-300 hover:border-slate-200 dark:hover:border-stone-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 dark:shadow-none dark:hover:shadow-2xl dark:${mojito.shadow}`}>
        
        {/* Contenedor de la Imagen clickeable */}
        <div 
          onClick={handleOpenModal}
          className="relative h-64 mb-6 mt-2 flex justify-center items-center overflow-visible drop-shadow-[0_15px_15px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] cursor-pointer group-hover:scale-105 transition-transform duration-300 active:scale-95"
          title="Ver detalle del mojito"
        >
          {/* Indicador de "Click para agrandar" */}
          <div className="absolute top-0 right-0 bg-white/80 dark:bg-stone-800/80 backdrop-blur-md rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 z-20 shadow-sm border border-slate-100 dark:border-stone-700">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
          </div>

          <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 dark:opacity-10 bg-gradient-to-br ${mojito.textGradient} blur-2xl group-hover:blur-3xl transition-all duration-500`} />
          <img 
            src={mojito.image} 
            alt={mojito.name} 
            className="h-[115%] object-contain transition-transform duration-500 group-hover:rotate-3 relative z-10"
          />
        </div>

        <div className="relative z-10 text-center flex-1 flex flex-col">
          <h3 className={`text-2xl font-black mb-2 bg-gradient-to-r ${mojito.textGradient} bg-clip-text text-transparent drop-shadow-sm dark:drop-shadow-none cursor-pointer`} onClick={handleOpenModal}>
            {mojito.name}
          </h3>
          
          <p className="text-slate-600 dark:text-stone-400 font-medium text-sm mb-5 h-10 line-clamp-2 transition-colors">
            {mojito.description}
          </p>

          <div className="mb-6 mt-auto">
            <div className="flex flex-wrap justify-center gap-1.5">
              {alcoholLevels.map(level => (
                <button
                  key={level.id}
                  onClick={() => setSelectedAlcohol(level)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-full border transition-all cursor-pointer ${
                    selectedAlcohol.id === level.id
                      ? `bg-gradient-to-r ${mojito.textGradient} border-transparent text-white shadow-md dark:shadow-black/50`
                      : "border-slate-200 dark:border-stone-700 text-slate-400 dark:text-stone-400 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-stone-800/50 bg-transparent"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="text-2xl font-black text-slate-800 dark:text-white transition-colors">
              ${currentPrice.toLocaleString("es-CL")}
            </div>
            <button
              onClick={handleAdd}
              className={`cursor-pointer px-5 py-2.5 rounded-full font-black text-white shadow-[0_8px_15px_rgba(0,0,0,0.1)] dark:shadow-none transition-transform transform active:scale-95 hover:-translate-y-0.5 bg-gradient-to-r ${mojito.textGradient} hover:brightness-105`}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* MODAL EXPANDIDO (Click a la foto)                    */}
      {/* Utilizamos createPortal para saltarnos el z-index de la página y que el Header no nos bloquee */}
      {/* ================================================== */}
      {isModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex justify-center items-center p-4 sm:p-6"
          onClick={handleCloseModal} // Cerrar al tocar fondo
        >
          {/* Fondo oscuro borroso */}
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-fade-in" />
          
          {/* Contenedor Modal: Completamente Responsivo */}
          <div 
            className="relative w-full max-w-4xl bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] animate-modal-pop max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevenir que el click adentro cierre
          >
            {/* Botón X Flotante encima de la imagen */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-stone-800 shadow-md text-slate-500 dark:text-stone-400 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-stone-700 transition-colors z-[110] cursor-pointer backdrop-blur-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {/* COLUMNA IZQUIERDA: IMAGEN A PANTALLA COMPLETA EN SU MITAD */}
            {/* object-cover asegura que llene el recuadro sin importar el tamaño de la foto, y overflow-hidden redondea las esquinas juntas al contenedor */}
            <div className="w-full md:w-5/12 h-[30vh] md:h-auto min-h-[220px] relative bg-slate-100 dark:bg-stone-950 shrink-0">
               <img 
                 src={mojito.image} 
                 alt={`Foto de ${mojito.name}`} 
                 className="absolute inset-0 w-full h-full object-cover" 
               />
            </div>

            {/* COLUMNA DERECHA: INFORMACIÓN Y BOTONES */}
            <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col text-left overflow-y-auto custom-scrollbar">
              
              <h3 className={`text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r ${mojito.textGradient} bg-clip-text text-transparent leading-tight drop-shadow-sm`}>
                {mojito.name}
              </h3>
              
              <p className="text-slate-600 dark:text-stone-400 text-base mb-6 font-medium leading-relaxed">
                {mojito.description}
              </p>

              {/* Selector de Alcohol */}
              <div className="w-full mb-6 mt-auto">
                <label className="block text-xs font-black text-slate-400 dark:text-stone-500 uppercase tracking-widest mb-3">
                  Punto de Alcohol
                </label>
                <div className="flex flex-wrap justify-start gap-2.5">
                  {alcoholLevels.map(level => (
                    <button
                      key={`modal-${level.id}`}
                      onClick={() => setSelectedAlcohol(level)}
                      className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                        selectedAlcohol.id === level.id
                          ? `bg-slate-800 dark:bg-stone-200 border-slate-800 dark:border-white text-white dark:text-stone-900 shadow-[0_5px_15px_rgba(0,0,0,0.15)]`
                          : "border-slate-200 dark:border-stone-700 text-slate-500 dark:text-stone-400 hover:border-slate-300 dark:hover:border-stone-600 hover:bg-slate-50 dark:hover:bg-stone-800 bg-white dark:bg-stone-900/50"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón Inferior y Precio */}
              <div className="pt-4 border-t border-slate-100 dark:border-stone-800 flex flex-row items-center justify-between gap-4">
                 <div className="flex flex-col">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total</span>
                   <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                     ${currentPrice.toLocaleString("es-CL")}
                   </span>
                 </div>
                 
                 <button
                    onClick={handleAdd}
                    className={`flex-1 max-w-[200px] cursor-pointer px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-white text-base sm:text-lg shadow-[0_15px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_5px_25px_rgba(0,0,0,0.3)] transition-transform transform active:scale-95 hover:-translate-y-1 bg-gradient-to-r ${mojito.textGradient} hover:brightness-105 flex justify-center items-center`}
                  >
                    Añadir al Pedido
                 </button>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
