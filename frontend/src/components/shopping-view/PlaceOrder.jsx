import React, { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import placeOrder from "../../assets/placeOrder.png";
import { 
  Minus, Plus, MapPin, Package, CreditCard, 
  ChevronLeft, Truck, ShieldCheck, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PlaceOrder = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();
  
  const location = useLocation();
  const navigate = useNavigate();
  const { sellerUniqueId: sellerId, isbnId: isbn } = location.state || {};

  const [quantity, setQuantity] = useState(1);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [isOrderPlacing, setIsOrderPlacing] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchCitySuggestions = async (query) => {
    if (!query || query.length < 3) return;
    setIsSearchingCities(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setCitySuggestions(data);
    } catch (error) {
      console.error("Suggestion error:", error);
    } finally {
      setIsSearchingCities(false);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchCitySuggestions, 400);

  const handleCitySelect = (suggestion) => {
    const cityName = suggestion.display_name.split(",")[0];
    setValue("city", cityName);
    setValue("state", suggestion.address.state || "");
    setValue("country", suggestion.address.country || "");
    setValue("zipCode", suggestion.address.postcode || "");
    clearErrors(["city", "state", "country", "zipCode"]);
    setCitySuggestions([]);
    setShowSuggestions(false);
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Please log in to continue");

    setIsOrderPlacing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/order/api/v1/order-book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: `Bearer ${token}`,
          sellerId,
          isbn,
          quantity,
          shippingAddress: data,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsOrderSuccess(true);
        toast.success("Order Secured!");
        setTimeout(() => navigate("/user"), 2000);
      } else {
        toast.error(result.message || "Order failed");
      }
    } catch (error) {
      toast.error("Network error. Try again.");
    } finally {
      setIsOrderPlacing(false);
    }
  };

  return (
    // Added pt-32 to ensure content starts below any fixed headers
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Orbs - Lowered z-index and opacity */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full -z-0" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full -z-0" />

      <AnimatePresence>
        {isOrderPlacing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center"
          >
            <div className="text-center">
               {!isOrderSuccess ? (
                 <>
                  <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin mx-auto mb-6" />
                  <h2 className="text-xl font-black uppercase tracking-widest italic">Processing</h2>
                 </>
               ) : (
                 <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                    <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
                    <h2 className="text-3xl font-black uppercase italic">Confirmed</h2>
                    <p className="text-zinc-500 mt-2 font-bold tracking-widest text-[10px]">REDIRECTING...</p>
                 </motion.div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exit Checkout</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Summary Column */}
          <div className="lg:col-span-5 space-y-10">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-6xl font-black uppercase italic leading-[0.9] tracking-tighter">
                Finalize <br />
                <span className="text-blue-600 not-italic">Order</span>
              </h1>
              <p className="text-zinc-500 mt-6 text-sm leading-relaxed max-w-xs font-medium border-l border-white/10 pl-4">
                Verify your shipping details below. All data is processed through secure protocols.
              </p>
            </motion.div>

            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/20 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md shadow-2xl">
              <img src={placeOrder} alt="Cart" className="w-full h-44 object-contain mb-10 drop-shadow-2xl" />
              <div className="grid grid-cols-1 gap-4">
                <FeatureItem icon={<Truck className="w-4 h-4"/>} title="Express Rail" desc="2-4 Day Delivery" />
                <FeatureItem icon={<ShieldCheck className="w-4 h-4"/>} title="Verified" desc="Secure Connection" />
              </div>
            </div>
          </div>

          {/* Form Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-[#0a0a0b] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-8 flex items-center gap-4">
                  <div className="h-[1px] w-6 bg-blue-500"></div>
                  Shipping Endpoint
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="md:col-span-2">
                    <Input 
                        label="Delivery Street" 
                        placeholder="Street address and house number"
                        {...register("street", { required: "Address is required" })} 
                        error={errors.street} 
                    />
                  </div>
                  
                  <div className="relative">
                    <label className="text-[9px] font-black uppercase text-zinc-500 ml-1 mb-2 block tracking-widest">City</label>
                    <input
                      {...register("city", { required: "City is required" })}
                      placeholder="Search..."
                      autoComplete="off"
                      onChange={(e) => {
                        setValue("city", e.target.value);
                        debouncedFetchSuggestions(e.target.value);
                        setShowSuggestions(true);
                      }}
                      className={`w-full bg-white/[0.03] border ${errors.city ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 focus:border-blue-600 outline-none transition-all placeholder:text-zinc-800 text-sm font-bold`}
                    />
                    {isSearchingCities && <div className="absolute right-4 top-11 animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full" />}
                    
                    <AnimatePresence>
                      {showSuggestions && citySuggestions.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="absolute z-50 w-full mt-3 bg-[#0d0d0f] border border-white/10 rounded-2xl overflow-hidden shadow-3xl"
                        >
                          {citySuggestions.map((s, i) => (
                            <button
                              key={i} type="button"
                              className="w-full text-left px-5 py-4 text-[11px] font-bold hover:bg-blue-600 transition-colors border-b border-white/5 last:border-0"
                              onClick={() => handleCitySelect(s)}
                            >
                              {s.display_name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {errors.city && <span className="text-[9px] text-red-500 mt-2 ml-1 font-black uppercase">{errors.city.message}</span>}
                  </div>

                  <Input label="State" placeholder="Province/State" {...register("state", { required: "Required" })} error={errors.state} />
                  <Input label="Postal Code" placeholder="ZIP/PIN" {...register("zipCode", { required: "Required" })} error={errors.zipCode} />
                  <Input label="Country" placeholder="Country Name" {...register("country", { required: "Required" })} error={errors.country} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-end justify-between gap-10 pt-10 border-t border-white/5">
                <div className="w-full md:w-auto">
                   <label className="text-[9px] font-black uppercase text-zinc-500 block mb-4 ml-1 tracking-[0.2em]">Quantity</label>
                   <div className="flex items-center bg-white/[0.03] rounded-2xl p-1.5 border border-white/10 w-fit">
                      <button type="button" onClick={decrement} className="p-3.5 hover:text-blue-500 transition-all hover:bg-white/5 rounded-xl"><Minus size={12}/></button>
                      <span className="w-14 text-center font-black text-xl">{quantity}</span>
                      <button type="button" onClick={increment} className="p-3.5 hover:text-blue-500 transition-all hover:bg-white/5 rounded-xl"><Plus size={12}/></button>
                   </div>
                </div>

                <button
                  type="submit"
                  disabled={isOrderPlacing}
                  className="w-full md:w-auto flex-grow h-[72px] bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-xl shadow-blue-600/10 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Confirm Transaction
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

// Internal Components
const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.02]">
    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shadow-inner">
      {icon}
    </div>
    <div>
      <h4 className="text-[10px] font-black uppercase tracking-widest text-white">{title}</h4>
      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tight mt-0.5">{desc}</p>
    </div>
  </div>
);

const Input = forwardRef(({ label, error, ...props }, ref) => (
  <div className="flex flex-col">
    <label className="text-[9px] font-black uppercase text-zinc-500 ml-1 mb-2 tracking-widest">{label}</label>
    <input
      ref={ref}
      {...props}
      className={`bg-white/[0.03] border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 focus:border-blue-600 outline-none transition-all placeholder:text-zinc-800 text-sm font-bold`}
    />
    {error && <span className="text-[9px] text-red-500 mt-2 ml-1 font-black uppercase tracking-wider">{error.message}</span>}
  </div>
));

Input.displayName = "Input";

export default PlaceOrder;