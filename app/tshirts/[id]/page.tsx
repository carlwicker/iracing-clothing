"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import tshirts from "@/json/tshirts.json";
import { useContext, useState } from "react";
import { CartContext } from "@/components/ShoppingCart";

interface TShirt {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
}

const tshirtData = tshirts as TShirt[];

export default function TShirtDetailsPage() {
  const params = useParams();
  const cartContext = useContext(CartContext);
  const tshirtId = parseInt(params.id as string);
  const tshirt = tshirtData.find((t) => t.id === tshirtId);

  const [selectedColor, setSelectedColor] = useState(
    tshirt ? tshirt.colors[0] : ""
  );
  const [selectedSize, setSelectedSize] = useState(
    tshirt ? tshirt.sizes[0] : ""
  );

  if (!tshirt) {
    return <div className="text-center py-8">T-Shirt not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-96">
          <Image
            src={tshirt.image}
            alt={tshirt.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4 text-center md:text-left">
            {tshirt.name}
          </h1>
          <p className="text-xl text-gray-600 mb-4 text-center md:text-left">
            ${tshirt.price.toFixed(2)}
          </p>
          <p className="mb-6 text-center md:text-left">{tshirt.description}</p>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Available Colors:</h3>
            <div className="flex gap-2 justify-center md:justify-start">
              {tshirt.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedColor === color ? "border-black" : ""
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Available Sizes:</h3>
            <div className="flex gap-2 justify-center md:justify-start">
              {tshirt.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg bg-gray-100 ${
                    selectedSize === size ? "border-black" : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() =>
                cartContext?.addToCart({
                  id: tshirt.id,
                  name: tshirt.name,
                  price: tshirt.price,
                  image: tshirt.image,
                  description: tshirt.description,
                  colors: [selectedColor],
                  sizes: [selectedSize],
                  quantity: 1,
                })
              }
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
