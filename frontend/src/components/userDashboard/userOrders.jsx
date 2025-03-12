import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const userData = useOutletContext();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/order/user-order-list/${userData.userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setOrders(data.orderData[0]?.orders || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userData.userId]);

  const openOrderDetails = (order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/order/api/v1/cancel-order`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId: selectedOrder.orderId }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setOrders(orders.filter(order => order.orderId !== selectedOrder.orderId));
        closeModal();
      } else {
        alert("Failed to cancel the order.");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  return (
    <div className="relative w-full min-h-screen p-5 flex justify-center items-center">
      <Card className="w-full max-w-4xl text-white shadow-2xl rounded-lg overflow-hidden">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-[3rem] font-bold text-center text-gray-100">
            My Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader className="animate-spin text-gray-400" size={32} />
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-700 rounded-lg mt-5 shadow-md p-6 hover:bg-gray-600 transition cursor-pointer"
                onClick={() => openOrderDetails(order)}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="text-lg font-semibold text-gray-200">
                    {order.seller.storeName}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300 font-medium">Status:</span>
                  <span className="text-sm capitalize font-bold text-blue-400">
                    {order.status === "pending" ? "Placed" : order.status}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-400">No orders found.</p>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
          <div className="bg-backgroundContrast rounded-lg shadow-2xl w-full max-w-lg p-6 relative text-gray-100">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-200 text-3xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Order Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-700 pb-3">
                <span className="font-semibold">Store Name:</span>
                <span>{selectedOrder.seller.storeName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-3">
                <span className="font-semibold">Order Date:</span>
                <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-3">
                <span className="font-semibold">Price:</span>
                <span>₹{selectedOrder.price}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-3 font-bold text-blue-400">
                <span className="font-semibold">Status:</span>
                <span className="capitalize">
                  {selectedOrder.status === "pending" ? "Placed" : selectedOrder.status}
                </span>
              </div>
              <div className="pt-3">
                <h3 className="font-semibold mb-2">Shipping Address:</h3>
                <p>
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, 
                  {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zipCode}
                </p>
              </div>
              {selectedOrder.status !== "completed" && selectedOrder.status !== "cancelled" && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={handleCancelOrder}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Cancel Order
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
