import { useState, useEffect } from "react";

export default function Cart({ isOpen, onClose, cart, setCart }) {
  const [isDelivery, setIsDelivery] = useState(false);
  
  const hasFreeDeliveryPromo = cart.some((item) => item.isFreeDelivery === true);
  const deliveryFee = hasFreeDeliveryPromo ? 0 : 2000;
  
  const subtotal = cart.reduce((acc, item) => acc + item.finalPrice, 0);
  const total = subtotal + (isDelivery ? deliveryFee : 0);

  // Forzar que el reparto esté activo si se gana envío gratis
  useEffect(() => {
    if (hasFreeDeliveryPromo) {
      setIsDelivery(true);
    }
  }, [hasFreeDeliveryPromo]);

  // Prevenir scroll del fondo (scroll bleed) en móviles
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const [itemToDelete, setItemToDelete] = useState(null);

  const confirmRemove = () => {
    if (!itemToDelete) return;
    setCart((prev) => prev.filter((item) => item.cartId !== itemToDelete.cartId));
    setItemToDelete(null);
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    
    const phone = "56968976411";
    let text = "🌴 *¡Hola! Quisiera realizar mi pedido de Mojitos:* \n\n";
    
    cart.forEach(item => {
      text += `🍹 1x ${item.name} (${item.alcoholLevel.label}) = $${item.finalPrice.toLocaleString("es-CL")}\n`;
      if (item.description && item.description.startsWith("Sabores:")) {
        text += `   ↳ ${item.description}\n`;
      }
    });
    
    text += `\n📝 *Subtotal:* $${subtotal.toLocaleString("es-CL")}`;
    if (isDelivery) {
      if (hasFreeDeliveryPromo) {
        text += `\n🛵 *Reparto:* ¡GRATIS! 🎁`;
      } else {
        text += `\n🛵 *Reparto:* $${deliveryFee.toLocaleString("es-CL")}`;
      }
      text += `\n📍 *Método:* Envío a domicilio. Mándame tu dirección por acá por favor!`;
    } else {
      text += `\n🏡 *Método:* Retiro en el local (Villa Perales, pasaje el manzano, casa 25)`;
    }
    
    text += `\n\n💰 *Total a pagar:* $${total.toLocaleString("es-CL")}\n\n`;

    text += `¡Quedo atento/a para coordinar!`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-stone-950 border-l border-slate-100 dark:border-stone-800 z-[60] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-stone-800 flex items-center justify-between bg-emerald-50/50 dark:bg-stone-900/50 transition-colors">
          <h2 className="text-2xl font-black text-emerald-700 dark:text-emerald-400">Tu Pedido Fresco</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 dark:hover:bg-stone-800 text-slate-500 dark:text-stone-400 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-stone-950 transition-colors">
          {cart.length === 0 ? (
            <div className="text-center text-slate-400 dark:text-stone-500 mt-32">
              <svg xmlns="http://www.w3.org/.w3.org/2000/svg" className="w-20 h-20 mx-auto mb-6 opacity-30 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <p className="text-lg font-medium">Aún no hay sed en el carrito.</p>
              <button 
                onClick={onClose}
                className="mt-6 font-bold text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:underline cursor-pointer tracking-wide"
              >
                Explorar el menú
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex gap-4 p-4 rounded-3xl bg-white dark:bg-stone-900 border border-slate-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-20 h-20 shrink-0 bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-stone-950 dark:to-stone-950 rounded-2xl overflow-hidden flex items-center justify-center p-2 relative">
                  <div className={`absolute inset-0 opacity-10 bg-gradient-to-b ${item.textGradient}`}></div>
                  <img src={item.image} alt={item.name} className="h-[120%] object-contain drop-shadow-md dark:drop-shadow-xl relative z-10" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="font-black text-slate-800 dark:text-stone-200 text-lg leading-tight truncate transition-colors">{item.name}</h4>
                  <p className="text-sm font-medium text-slate-500 dark:text-stone-400 mt-1 transition-colors">{item.alcoholLevel.label}</p>
                  <p className="font-bold text-emerald-500 dark:text-emerald-400 mt-auto">${item.finalPrice.toLocaleString("es-CL")}</p>
                </div>
                <button 
                  onClick={() => setItemToDelete(item)}
                  className="w-10 h-10 mt-auto rounded-full flex items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-300 dark:text-stone-500 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-white dark:bg-stone-900 border-t border-slate-100 dark:border-stone-800 shadow-[0_-15px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-10 transition-colors duration-300">
            {/* resto del carrito */}
            <div className="flex flex-col gap-3 mb-5">
              {hasFreeDeliveryPromo ? (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30">
                   <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white text-xl shadow-md">🎁</div>
                   <div>
                     <p className="font-black text-orange-600 dark:text-orange-400 text-lg leading-tight uppercase tracking-wide">Envío Gratis Activado</p>
                     <p className="text-sm font-bold text-orange-500/80 dark:text-orange-300/80 mt-0.5">¡Tu promo incluye el despacho!</p>
                   </div>
                </div>
              ) : (
                <label className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer bg-slate-50 dark:bg-stone-950 border border-slate-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-colors group">
                  <input 
                    type="checkbox" 
                    checked={isDelivery}
                    onChange={() => setIsDelivery(!isDelivery)}
                    className="w-6 h-6 rounded-md border-slate-300 dark:border-stone-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-white dark:focus:ring-offset-stone-950 bg-white dark:bg-stone-900 cursor-pointer transition-colors shadow-sm"
                  />
                  <div className="flex-1 select-none">
                    <p className="font-bold text-slate-800 dark:text-stone-200 text-lg group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">Quiero reparto 🛵</p>
                    <p className="text-sm font-medium text-slate-500 dark:text-stone-400">Se añaden ${deliveryFee} al total</p>
                  </div>
                </label>
              )}

              {!isDelivery && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-stone-800/30 border border-emerald-100 dark:border-stone-700 text-sm text-center text-slate-600 dark:text-stone-400 transition-colors">
                  <p className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">🏡 Retiro en local</p>
                  <p>Villa Perales, pasaje el manzano, casa 25</p>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6 font-medium text-slate-500 dark:text-stone-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-700 dark:text-stone-300">${subtotal.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between">
                <span>Reparto</span>
                <span className={`font-bold ${hasFreeDeliveryPromo ? 'text-orange-500' : 'text-slate-700 dark:text-stone-300'}`}>
                  {isDelivery ? (hasFreeDeliveryPromo ? 'GRATIS' : `$${deliveryFee.toLocaleString("es-CL")}`) : "$0"}
                </span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-800 dark:text-white pt-4 border-t border-slate-100 dark:border-stone-800 mt-4 transition-colors">
                <span>Total a pagar</span>
                <span className="text-emerald-600 dark:text-emerald-400">${total.toLocaleString("es-CL")}</span>
              </div>
            </div>

            <button 
              onClick={handleWhatsAppOrder}
              className="w-full py-4 px-6 rounded-full font-black text-white dark:text-stone-950 bg-emerald-500 dark:bg-emerald-400 hover:bg-emerald-400 dark:hover:bg-emerald-300 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(16,185,129,0.3)] dark:shadow-[0_0_20px_rgba(52,211,153,0.3)] cursor-pointer text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              Confirmar por WhatsApp
            </button>
          </div>
        )}
        {/* MODAL CONFIRMAR ELIMINACIÓN */}
        {itemToDelete && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setItemToDelete(null)} />
            <div className="relative bg-white dark:bg-stone-900 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl animate-modal-pop text-center border border-slate-100 dark:border-stone-800">
              <div className="w-16 h-16 mx-auto bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">¿Quitar del pedido?</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-stone-400 mb-6 px-2">
                Estás a punto de eliminar <strong className="text-slate-700 dark:text-stone-300 block mt-1">{itemToDelete.name}</strong>
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setItemToDelete(null)}
                  className="flex-3 py-3 rounded-xl font-bold bg-slate-100 dark:bg-stone-800 text-slate-600 dark:text-stone-300 hover:bg-slate-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                >
                  Mejor no
                </button>
                <button 
                  onClick={confirmRemove}
                  className="flex-4 py-3 rounded-xl font-black bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 transition-colors cursor-pointer"
                >
                  Sí, quitar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
