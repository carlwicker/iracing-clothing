import { NextResponse } from "next/server";
import Stripe from "stripe";
import tshirts from "@/json/tshirts.json";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

export async function POST() {
  try {
    const createdProducts = [];

    for (const tshirt of tshirts) {
      // Create a Stripe Product
      const product = await stripe.products.create({
        name: tshirt.name,
        description: tshirt.description,
        images: [`${process.env.NEXT_PUBLIC_BASE_URL}${tshirt.image}`],
      });

      // Create a Stripe Price for the Product
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(tshirt.price * 100), // Convert to cents
        currency: "usd",
      });

      createdProducts.push({
        id: tshirt.id,
        stripeProductId: product.id,
        stripePriceId: price.id,
      });
    }

    return NextResponse.json({ success: true, products: createdProducts });
  } catch (error) {
    console.error("Error creating Stripe products:", error);
    return NextResponse.json(
      {
        error: "Failed to create Stripe products",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
