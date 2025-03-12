import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const SellerAccount = () => {
  const { sellerData } = useOutletContext();

  const getInitials = (name) =>
    name?.split(" ").map((word) => word[0]).join("").toUpperCase();

  const capitalize = (word) => word?.toUpperCase();

  if (!sellerData) {
    return (
      <div className="text-center p-8 text-2xl font-semibold text-gray-300">
        Loading seller data...
      </div>
    );
  }

  return (
    <Card className="shadow-xl rounded-2xl bg-[#2A2A2A] p-10 max-w-5xl w-full mx-auto relative overflow-hidden border border-gray-700">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 opacity-10 rounded-2xl"></div>
      
      <CardHeader className="flex flex-col items-center text-center">
        <div className="relative">
          <Avatar className="w-40 h-40 bg-gray-800 text-5xl font-bold text-white shadow-lg rounded-full border-4 border-gray-600">
            {sellerData?.image ? (
              <img
                src={sellerData.image}
                alt={sellerData.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span>{getInitials(sellerData?.name)}</span>
            )}
          </Avatar>
          <div className="absolute bottom-1 -right-3 bg-green-500 w-5 h-5 rounded-full border-2 border-gray-900"></div>
        </div>
        <h2 className="mt-4 text-3xl font-bold text-white tracking-wide">
          {capitalize(sellerData?.name)}
        </h2>
        <p className="text-gray-400 text-lg font-light">{capitalize(sellerData?.storeName)}</p>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6">
        <div className="p-4 rounded-xl">
          <h4 className="text-lg font-semibold text-white mb-3">Contact Info</h4>
          <p className="text-gray-400">📧 <span className="font-semibold">Email:</span> {sellerData?.email}</p>
          <p className="text-gray-400">📞 <span className="font-semibold">Mobile:</span> {sellerData?.mobile}</p>
          <p className="text-gray-400">💳 <span className="font-semibold">UPI ID:</span> {sellerData?.upiId || "N/A"}</p>
          <p className="text-gray-400">🧾 <span className="font-semibold">GST Number:</span> {sellerData?.gstNumber || "N/A"}</p>
        </div>

        <div className="p-4 shadow-xl">
          <h4 className="text-lg font-semibold text-white mb-3">Address</h4>
          <p className="text-gray-400">{sellerData?.address.street}</p>
          <p className="text-gray-400">{sellerData?.address.city}, {sellerData?.address.state}</p>
          <p className="text-gray-400">{sellerData?.address.country} - {sellerData?.address.zipCode}</p>
        </div>
      </CardContent>

      <CardFooter className="flex space-x-6 justify-center mt-6 pb-6">
        {sellerData.socialMediaLinks?.facebook && (
          <a href={sellerData.socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">
            <Button className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <FaFacebookF size={20} />
            </Button>
          </a>
        )}
        {sellerData.socialMediaLinks?.instagram && (
          <a href={sellerData.socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">
            <Button className="p-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-md">
              <FaInstagram size={20} />
            </Button>
          </a>
        )}
        {sellerData.socialMediaLinks?.linkedin && (
          <a href={sellerData.socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer">
            <Button className="p-3 rounded-full bg-blue-700 hover:bg-blue-800 text-white shadow-md">
              <FaLinkedinIn size={20} />
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default SellerAccount;
