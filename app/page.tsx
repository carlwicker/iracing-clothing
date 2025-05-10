import Image from "next/image";
import Link from "next/link";
import tshirts from "@/json/tshirts.json";

const featuredTshirts = tshirts.slice(0, 3);

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Featured T-Shirts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTshirts.map((tshirt) => (
              <Link
                href={`/tshirts/${tshirt.id}`}
                key={tshirt.id}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
                  <div className="relative aspect-square">
                    <Image
                      src={tshirt.image}
                      alt={tshirt.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {tshirt.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      ${tshirt.price.toFixed(2)}
                    </p>
                    <p className="text-gray-500 mb-4 line-clamp-2">
                      {tshirt.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
