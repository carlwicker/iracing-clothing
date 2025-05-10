"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/components/ShoppingCart";

export default function AccountPage() {
  const { addToCart } = useCart();

  const orderHistory = [
    {
      id: 1,
      name: "T-shirt",
      price: 25.0,
      image: "/img/tshirts/1.webp",
      description: "A comfortable cotton T-shirt",
      colors: ["Blue"],
      sizes: ["M"],
    },
    {
      id: 2,
      name: "Hoodie",
      price: 45.0,
      image: "/img/tshirts/2.webp",
      description: "A warm and cozy hoodie",
      colors: ["Black"],
      sizes: ["L"],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
        <p>Name: John Doe</p>
        <p>Email: john.doe@example.com</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Order History</h2>
        {orderHistory.map((item) => (
          <div
            key={`${item.id}-${item.sizes[0]}-${item.colors[0]}`}
            className="border-b py-4 flex items-center gap-4"
          >
            <div className="relative w-24 h-24">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p>Size: {item.sizes[0]}</p>
              <p>Color: {item.colors[0]}</p>
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
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Account Actions</h2>
        <button className="bg-gray-200 px-4 py-2 rounded-lg mr-4 hover:bg-gray-300">
          Update Details
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          Logout
        </button>
      </section>
    </div>
  );
}
