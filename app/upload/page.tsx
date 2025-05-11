"use client";

import { useState, useContext } from "react";
import Image from "next/image";
import { CartContext } from "@/components/ShoppingCart";

// Corrected the 'id' field in the 'Item' interface to be of type 'number'
interface Item {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
}

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [timecode, setTimecode] = useState("");
  const [camera, setCamera] = useState("");
  const [previewedItems] = useState<Item[]>([]); // Updated to use 'Item' type
  const cartContext = useContext(CartContext); // Use the correct cart context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("timecode", timecode);
    formData.append("camera", camera);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Uploaded successfully");
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md mx-auto mt-10"
      >
        <input
          type="file"
          accept=".rpy"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          className="border p-2 w-full bg-black text-white hover:cursor-pointer"
          placeholder="Select file"
        />
        <input
          type="text"
          value={timecode}
          onChange={(e) => setTimecode(e.target.value)}
          placeholder="Timecode (e.g. 12:34)"
          className="border p-2 w-full"
          required
        />
        <select
          value={camera}
          onChange={(e) => setCamera(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Camera</option>
          <option value="TV1">TV 1</option>
          <option value="TV2">TV 2</option>
          <option value="Cockpit">Cockpit</option>
          <option value="Gyro">Gyro</option>
          <option value="Chase">Chase</option>
          <option value="Nose">Nose</option>
          <option value="Blimp">Blimp</option>
        </select>
        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded  hover:cursor-pointer"
        >
          Upload
        </button>
      </form>
      <div className="mt-10 space-y-4">
        {previewedItems.map((item) => (
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
              <p>Size: {item.sizes[0]}</p>
              <p>Color: {item.colors[0]}</p>
              <button
                onClick={() =>
                  cartContext?.addToCart({
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
      </div>
    </div>
  );
}
