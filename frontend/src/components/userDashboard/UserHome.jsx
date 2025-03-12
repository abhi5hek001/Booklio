import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const UserHome = () => {
  const userData = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(
    "No address provided. Add your address below."
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/order/user-order-list/${
            userData.userId
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setOrders(data.orderData[0]?.orders || []);
          const firstOrderAddress =
            data.orderData[0]?.orders[0]?.shippingAddress;
          if (firstOrderAddress) {
            setAddress(
              `${firstOrderAddress.street}, ${firstOrderAddress.city}, ${firstOrderAddress.state}, ${firstOrderAddress.country} - ${firstOrderAddress.zipCode}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData.userId) {
      fetchOrders();
    }
  }, [userData.userId]);

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.price, 0);

  return (
    <div className="relative w-full min-h-screen p-10 flex justify-center items-center">
      <Card className="w-full max-w-4xl bg-backgroundContrast text-white shadow-2xl rounded-lg overflow-hidden">
        <div className="relative h-64 bg-gray-600 flex items-center justify-center">
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-black/30"
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <Avatar className="w-40 h-40 border-4 border-white shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <AvatarImage src={userData.image} alt={userData.name} />
            <AvatarFallback>{userData.name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <CardContent className="p-6 mt-10 text-center">
          <h2 className="text-2xl font-semibold text-gray-100">
            {userData.name}
          </h2>
          <p className="text-sm text-gray-300">Email: {userData.email}</p>
          <p className="text-sm text-gray-300">Mobile: {userData.mobile}</p>
          <p
            className={`text-sm font-semibold ${
              userData.is_verified ? "text-green-400" : "text-red-400"
            }`}
          >
            {userData.is_verified ? "Verified" : "Not Verified"}
          </p>
          <div className="mt-4 p-4 bg-gray-700 rounded-lg text-sm text-gray-200">
            <h3 className="font-semibold text-lg">Address</h3>
            <p>{address}</p>
            {!orders.length ||
            address === "No address provided. Add your address below." ? (
              <Button className="mt-2 bg-gray-600 hover:bg-gray-500">
                Add Address
              </Button>
            ) : null}
          </div>
          <div className="mt-6 grid grid-cols-2 text-center text-gray-200">
            <div>
              <p className="text-lg font-semibold">
                {loading ? "Loading..." : totalOrders}
              </p>
              <p className="text-sm">Total Orders</p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {loading ? "Loading..." : `₹${totalSpent}`}
              </p>
              <p className="text-sm">Total Spent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserHome;
