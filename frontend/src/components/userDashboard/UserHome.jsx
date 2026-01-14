import { useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  ShieldX,
  CreditCard,
  Clock,
  ChevronRight,
  Loader,
  XCircle,
  ShoppingBag,
  Tag,
  Info,
  CalendarDays,
  Hash
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-hot-toast";

/* ---------------------- Reusable Sub-Components ---------------------- */

const DetailRow = ({ label, value, highlight, success }) => (
  <div className="min-w-0">
    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-sm font-medium truncate ${highlight ? "text-white font-bold text-base" :
      success ? "text-green-400" : "text-slate-300"
      }`}>
      {Array.isArray(value) ? value.join(", ") : (value || "N/A")}
    </p>
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 group/item">
    <div className="mt-1 p-2 bg-white/5 rounded-lg text-slate-500 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/10 transition-all duration-300">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-1">
        {label}
      </p>
      <p className="text-sm text-slate-300 font-medium break-words leading-relaxed group-hover/item:text-white transition-colors">
        {value || "Not Provided"}
      </p>
    </div>
  </div>
);

const OrderCard = ({ order, onClick }) => {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "cancelled": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const bookTitle = order.bookInfo?.data?.volumeInfo?.title || order.bookName || "Untitled Book";
  const sellerName = order.seller?.storeName || "Booklio Seller";

  return (
    <motion.div
      whileHover={{ x: 5 }}
      onClick={onClick}
      className="group relative flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] hover:border-blue-500/30 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className={`p-3 rounded-xl transition-colors ${order.status === 'completed' ? 'bg-green-500/10 text-green-400' :
          order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
          }`}>
          <Package size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-white font-bold truncate group-hover:text-blue-400 transition-colors max-w-[150px] md:max-w-[250px]">
              {bookTitle}
            </h4>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
              {order.status === 'pending' ? 'Placed' : order.status}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Seller:</span>
            <span className="text-[10px] font-bold text-slate-400">{sellerName}</span>
          </div>
        </div>
      </div>
      <div className="text-right ml-4">
        <p className="text-white font-black italic">₹{order.price}</p>
        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
};

/* ----------------------------- Main Page ------------------------------ */

const UserHome = () => {
  const userData = useOutletContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("No address provided.");

  const [showAllOrders, setShowAllOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/order/user-order-list/${userData.userId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
        );
        const data = await response.json();
        if (data.success && data.orderData?.length > 0) {
          const userOrders = data.orderData[0].orders || [];
          setOrders(userOrders);
          if (userOrders[0]?.shippingAddress) {
            const addr = userOrders[0].shippingAddress;
            setAddress(`${addr.street}, ${addr.city}, ${addr.state}`);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userData?.userId) fetchOrders();
  }, [userData?.userId]);

  const totalSpent = orders.reduce((s, o) => s + o.price, 0);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
    setShowAllOrders(false);
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);

      // 1. Remove the ${selectedOrder.orderId} from the URL string.
      // The URL must match your router.post path exactly.
      const url = `${import.meta.env.VITE_BASE_URL}/order/api/v1/cancel-order`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        // 2. Add the orderId to the body as a JSON string.
        // This allows your backend to do: const { orderId } = req.body;
        body: JSON.stringify({
          orderId: selectedOrder.orderId
        }),
      });

      const data = await res.json();

      // 3. Note: Your backend returns 'msg' instead of 'message', 
      // so we update the toast logic to match.
      if (res.ok && data.success) {
        toast.success(data.msg || "Order cancelled");

        // Update local state to reflect 'cancelled' status immediately
        setOrders(prev => prev.map(o =>
          o.orderId === selectedOrder.orderId ? { ...o, status: "cancelled" } : o
        ));

        setSelectedOrder(p => ({ ...p, status: "cancelled" }));
        setShowCancelConfirmation(false);
      } else {
        toast.error(data.msg || "Failed to cancel");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 p-4 md:p-10 pt-28 md:pt-36">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* PROFILE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <Card className="lg:col-span-5 bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden relative group">
            <CardContent className="p-6 md:p-8 relative pt-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex flex-col items-center md:min-w-[140px]">
                  <div className="relative">
                    <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                      <AvatarImage src={userData.image} />
                      <AvatarFallback className="bg-blue-600 text-2xl font-bold">{userData.name?.[0]}</AvatarFallback>
                    </Avatar>
                    {userData.is_verified && (
                      <div className="absolute bottom-1 right-1 bg-blue-500 p-1.5 rounded-full border-4 border-[#121214]">
                        <ShieldCheck className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-black text-white text-center italic tracking-tight uppercase leading-tight">{userData.name}</h2>
                </div>
                <div className="hidden md:block w-[1px] h-32 bg-white/10 self-center" />
                <div className="flex-1 space-y-5 w-full">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 text-center md:text-left">Details</h4>
                  <div className="space-y-4">
                    <DetailItem icon={<Mail size={16} className="text-blue-500" />} label="Email" value={userData.email} />
                    <DetailItem icon={<Phone size={16} className="text-blue-500" />} label="Phone" value={userData.mobile || "Not Linked"} />
                    <DetailItem icon={<MapPin size={16} className="text-blue-500" />} label="Shipping" value={address} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STATS SECTION */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10 p-8 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 blur-3xl" />
              <Package className="text-blue-500 mb-4" size={24} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Orders</p>
              <h3 className="text-5xl font-black text-white mt-2 italic">{loading ? "..." : orders.length}</h3>
            </Card>
            <Card className="bg-white/5 border-white/10 p-8 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 blur-3xl" />
              <CreditCard className="text-green-500 mb-4" size={24} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Spent</p>
              <h3 className="text-5xl font-black text-white mt-2 italic">₹{loading ? "..." : totalSpent.toLocaleString()}</h3>
            </Card>
          </div>
        </div>

        {/* RECENT SHIPMENTS */}
        <Card className="bg-white/5 border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-blue-500 rounded-full" />
                <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Recent Shipments</h3>
              </div>
              <Button
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 text-xs font-bold uppercase tracking-widest cursor-pointer relative z-20"
                onClick={() => setShowAllOrders(true)}
              >
                View All <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-4 flex-col p-6">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader className="animate-spin text-blue-500" />
                </div>
              ) : orders.length > 0 ? (
                [...orders] // Create a copy so you don't mutate the original state
                  .reverse() // Reverse the order
                  .slice(0, 3) // Take the first 3 (which are now the newest)
                  .map((o) => (
                    <OrderCard
                      key={o.orderId}
                      order={o}
                      onClick={() => handleOrderClick(o)}
                    />
                  ))
              ) : (
                <p className="text-center text-slate-500 py-10 italic">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* --- DIALOGS --- */}

        {/* ALL HISTORY */}
        <Dialog open={showAllOrders} onOpenChange={setShowAllOrders}>
          <DialogContent className="max-w-4xl bg-[#0d0d0f]/95 backdrop-blur-2xl border-white/10 text-white p-0 overflow-hidden shadow-2xl">
            <div className="h-1.5 w-full bg-blue-600" />
            <div className="p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-black italic uppercase">Order History</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="flex flex-col gap-4 pb-4">
                  {[...orders].reverse().map((o) => (
                    <OrderCard
                      key={o.orderId}
                      order={o}
                      onClick={() => handleOrderClick(o)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>

        {/* ORDER DETAILS */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] bg-[#0d0d0f]/95 backdrop-blur-2xl text-slate-200 border-white/10 p-0 overflow-hidden shadow-2xl">
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-purple-600" />
            <div className="p-8">
              <DialogHeader className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <DialogTitle className="text-3xl font-black text-white italic tracking-tighter uppercase">Details</DialogTitle>
                    <DialogDescription className="text-blue-500 font-mono text-[10px] mt-1 tracking-widest uppercase">ID: {selectedOrder?.orderId}</DialogDescription>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedOrder?.status === "completed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                    selectedOrder?.status === "cancelled" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}> {selectedOrder?.status} </div>
                </div>
              </DialogHeader>
              <ScrollArea className="h-[55vh] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-2"><ShoppingBag size={14} /> Item</h4>
                    <div className="space-y-4">
                      <DetailRow label="Title" value={selectedOrder?.bookInfo?.data?.volumeInfo?.title} highlight />
                      <DetailRow label="Author" value={selectedOrder?.bookInfo?.data?.volumeInfo?.authors} />
                      <div className="grid grid-cols-2 gap-4">
                        <DetailRow label="Qty" value={`x${selectedOrder?.quantity}`} />
                        <DetailRow label="ISBN" value={selectedOrder?.isbn} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-2"><MapPin size={14} /> Shipping</h4>
                    <div className="text-sm space-y-1">
                      <p className="text-white font-bold mb-1">{userData.name}</p>
                      <p>{selectedOrder?.shippingAddress?.street}</p>
                      <p>{selectedOrder?.shippingAddress?.city}, {selectedOrder?.shippingAddress?.state}</p>
                      <p className="text-slate-500 font-mono text-[10px] mt-2">{selectedOrder?.shippingAddress?.country} - {selectedOrder?.shippingAddress?.zipCode}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6 md:col-span-2 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1 w-full">
                      <DetailRow label="Date" value={new Date(selectedOrder?.createdAt).toLocaleDateString()} />
                      <DetailRow label="Seller" value={selectedOrder?.seller?.storeName} />
                      <DetailRow label="Status" value="Paid Secured" success />
                    </div>
                    <div className="text-right w-full md:w-auto">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Total</p>
                      <p className="text-4xl font-black text-white italic">₹{selectedOrder?.price}</p>
                    </div>
                  </div>
                </div>
                {selectedOrder?.status === "pending" && (
                  <div className="flex justify-end gap-4 mt-10 border-t border-white/5 pt-8">
                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Close</Button>
                    <Button className="bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white" onClick={() => setShowCancelConfirmation(true)}>Cancel Order</Button>
                  </div>
                )}
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>

        {/* CANCEL CONFIRMATION */}
        <Dialog open={showCancelConfirmation} onOpenChange={setShowCancelConfirmation}>
          <DialogContent className="max-w-md bg-[#0d0d0f]/95 backdrop-blur-2xl text-slate-200 border-white/10 p-0 overflow-hidden shadow-2xl">
            <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
            <div className="p-8 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
                <div className="relative bg-red-500/10 border border-red-500/20 p-5 rounded-full"><XCircle className="w-12 h-12 text-red-500" /></div>
              </div>
              <DialogTitle className="text-2xl font-black text-white uppercase italic tracking-tighter">Confirm <span className="text-red-500">Cancellation</span></DialogTitle>
              <DialogDescription className="text-slate-400 text-sm mt-4">Action cannot be reversed. Order #{selectedOrder?.orderId.slice(-10)}</DialogDescription>
              <div className="flex gap-3 mt-10 w-full">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowCancelConfirmation(false)}>No, Keep</Button>
                <Button className="flex-1 bg-red-600 rounded-xl" onClick={handleCancelOrder} disabled={loading}>{loading ? "Processing..." : "Yes, Cancel"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default UserHome;