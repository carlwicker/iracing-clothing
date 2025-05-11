"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/ShoppingCart";
import { useSession } from "next-auth/react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
}

export default function AccountPage() {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const [orderHistory, setOrderHistory] = useState<OrderItem[]>([]);

  useEffect(() => {
    // Fetch order history from an API or local storage
    const fetchOrderHistory = async () => {
      const response = await fetch("/api/orders");
      const data: OrderItem[] = await response.json();
      setOrderHistory(data);
    };

    fetchOrderHistory();
  }, []);

  const clearOrderHistory = async () => {
    // Clear order history via an API call or local storage
    await fetch("/app/api/orders", { method: "DELETE" });
    setOrderHistory([]);
  };

  if (!session) {
    return <p>You need to log in to view your account details.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
        <p>Name: {session.user?.name}</p>
        <p>Email: {session.user?.email}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Order History</h2>
        {orderHistory.length > 0 ? (
          orderHistory.map((item) => (
            <div
              key={`${item.id}-${item.sizes?.[0] || "default-size"}-${
                item.colors?.[0] || "default-color"
              }`}
              className="border-b py-4 flex items-center gap-4"
            >
              <div className="relative w-24 h-24">
                <Image
                  src={item?.image || "/public/img/tshirts/default-image.png"} // Fallback image
                  alt={item?.name || "Default Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p>Price: ${item.price ? item.price.toFixed(2) : "N/A"}</p>
                <p>
                  Size:{" "}
                  {item.sizes && item.sizes.length > 0 ? item.sizes[0] : "N/A"}
                </p>
                <p>
                  Color:{" "}
                  {item.colors && item.colors.length > 0
                    ? item.colors[0]
                    : "N/A"}
                </p>
                <button
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      description: item.description,
                      colors: item.colors,
                      sizes: item.sizes,
                      quantity: 1,
                    })
                  }
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
        <button
          onClick={clearOrderHistory}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Clear Order History
        </button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Account Actions</h2>
        <button className="bg-gray-200 px-4 py-2 rounded-lg mr-4 hover:bg-gray-300">
          Update Details
        </button>
        <a
          href="/api/auth/logout"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </a>
      </section>
    </div>
  );
}
