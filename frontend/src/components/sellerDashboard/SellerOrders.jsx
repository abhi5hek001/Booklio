import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerOrders } from "../../store/sellerSlice";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const SellerOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { sellerData } = useOutletContext();
  const sellerId = sellerData?.sellerId;

  const dispatch = useDispatch();

  // Get orders from Redux
  const { sellerOrders, loading, error } = useSelector((state) => state.seller);

  useEffect(() => {
    if (sellerId) {
      dispatch(fetchSellerOrders(sellerId));
    }
  }, [sellerId, dispatch]);

  if (loading)
    return <div className="text-center p-6 text-lg">Loading orders...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;
  if (!sellerOrders || sellerOrders.length === 0)
    return <div className="text-center">No orders available.</div>;

  return (
    <div className="p-6 bg-[#232323] rounded-lg shadow-md">
      <Table className="min-w-full border-collapse">
        <TableHeader className="bg-gray-700">
          <TableRow>
            <TableHead className="py-4 px-6 text-left">Order ID</TableHead>
            <TableHead className="py-4 px-6 text-left">ISBN</TableHead>
            <TableHead className="py-4 px-6 text-left">Price (₹)</TableHead>
            <TableHead className="py-4 px-6 text-left">Status</TableHead>
            <TableHead className="py-4 px-6 text-left">Customer</TableHead>
            <TableHead className="py-4 px-6 text-left">
              Shipping Address
            </TableHead>
            <TableHead className="py-4 px-6 text-left">Order Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sellerOrders.map((order) => (
            <TableRow
              key={order.orderId}
              className="hover:bg-gray-600 transition-colors cursor-pointer rounded-lg"
              onClick={() => setSelectedOrder(order)}
            >
              <TableCell className="py-3 px-6">{order.orderId}</TableCell>
              <TableCell className="py-3 px-6">{order.isbn}</TableCell>
              <TableCell className="py-3 px-6 font-semibold">
                ₹{order.price}
              </TableCell>
              <TableCell className="py-3 px-6 text-green-500 font-semibold">
                Placed
              </TableCell>
              <TableCell className="py-3 px-6">
                <div className="font-medium">{order.user.name}</div>
                <div className="text-sm text-white">{order.user.mobile}</div>
              </TableCell>
              <TableCell className="py-3 px-6 text-white">
                {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}, {order.shippingAddress.zipCode}
              </TableCell>
              <TableCell className="py-3 px-6">
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-lg p-8 rounded-lg shadow-xl bg-[#232323] text-white">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold mb-4">
                Order Details
              </DialogTitle>
              <DialogDescription className="mb-6">
              <p>
              <strong className="text-gray-100 text-sm">Details for Order ID:</strong>{" "}
              {selectedOrder.orderId}
              </p>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                <strong className="text-gray-100">ISBN:</strong>{" "}
                {selectedOrder.isbn}
              </p>
              <p>
                <strong className="text-gray-100">Price:</strong>{" "}
                <span className="text-lg font-semibold">
                  ₹{selectedOrder.price}
                </span>
              </p>
              <p>
                <strong className="text-gray-100">Status:</strong>{" "}
                <span className="text-green-500 font-semibold">Placed</span>
              </p>
              <p>
                <strong className="text-gray-100">Customer:</strong>{" "}
                {selectedOrder.user.name}
              </p>
              <p>
                <strong className="text-gray-100">Mobile:</strong>{" "}
                {selectedOrder.user.mobile}
              </p>
              <p>
                <strong className="text-gray-100">Shipping Address:</strong>
                <br />
                {selectedOrder.shippingAddress.street},{" "}
                {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.state},{" "}
                {selectedOrder.shippingAddress.zipCode}
              </p>
              <p>
                <strong className="text-gray-100">Order Date:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SellerOrders;
