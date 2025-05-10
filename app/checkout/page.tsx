"use client";

import { useCart } from "@/components/ShoppingCart";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const { cartItems, addToCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement checkout logic
    console.log("Checkout submitted");
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Your cart is empty</p>
            <Link
              href="/tshirts"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
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
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
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
                    Add Another
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
