import { NextResponse } from "next/server";
import Stripe from "stripe";
import tshirts from "@/json/tshirts.json";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

export async function POST(request: Request) {
  let cartItems: Array<{
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }> = []; // Initialize cartItems as an empty array by default
  let currency: string | undefined;

  try {
    console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

    ({ cartItems, currency } = await request.json());

    console.log("Incoming cartItems:", cartItems);
    console.log("Incoming currency:", currency);

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Invalid cartItems" }, { status: 400 });
    }

    if (!currency || typeof currency !== "string") {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    if (!currency) {
      throw new Error("Currency is undefined or invalid");
    }

    // Map product prices from tshirts.json
    const productPrices = new Map(
      tshirts.map((tshirt) => [tshirt.name, tshirt.price])
    );

    console.log("Product Prices Map:", productPrices);

    console.log("Before mapping cartItems:", cartItems);

    console.log("Received cartItems from frontend:", cartItems);

    cartItems.forEach((item) => {
      if (!item.name || typeof item.name !== "string") {
        console.error(`Invalid or missing name for item:`, item);
      }
      if (!item.price || typeof item.price !== "number") {
        console.error(`Invalid or missing price for item:`, item);
      }
      if (!item.quantity || typeof item.quantity !== "number") {
        console.error(`Invalid or missing quantity for item:`, item);
      }
    });

    cartItems.forEach((item) => {
      if (!productPrices.has(item.name)) {
        console.warn(`Item name '${item.name}' not found in tshirts.json`);
      }
    });

    cartItems = cartItems.map((item) => ({
      ...item,
      price: productPrices.get(item.name) || 0, // Fetch price from tshirts.json or default to 0
      quantity: Number(item.quantity), // Ensure quantity is a number
    }));

    console.log("Mapped cartItems:", cartItems);

    console.log("After mapping cartItems:", cartItems);

    // Validate each item in cartItems
    cartItems.forEach((item, index) => {
      if (!item.name || typeof item.name !== "string") {
        throw new Error(
          `Invalid or missing name for item at index ${index}: ${JSON.stringify(
            item
          )}`
        );
      }
      if (!item.price || typeof item.price !== "number" || item.price <= 0) {
        throw new Error(
          `Invalid or missing price for item at index ${index}: ${JSON.stringify(
            item
          )}`
        );
      }
      if (
        !item.quantity ||
        typeof item.quantity !== "number" ||
        item.quantity <= 0
      ) {
        throw new Error(
          `Invalid or missing quantity for item at index ${index}: ${JSON.stringify(
            item
          )}`
        );
      }
    });

    // Log each item in cartItems for debugging
    cartItems.forEach((item, index) => {
      console.log(`Item ${index}:`, item);
    });

    // Calculate total amount from cart items
    const amount =
      cartItems.reduce(
        (total: number, item: { price: number; quantity: number }) => {
          if (
            isNaN(item.price) ||
            typeof item.price !== "number" ||
            isNaN(item.quantity) ||
            typeof item.quantity !== "number"
          ) {
            throw new Error(
              `Invalid price or quantity for item: ${JSON.stringify(item)}`
            );
          }
          return total + item.price * item.quantity;
        },
        0
      ) * 100; // Convert to cents

    console.log("Calculated Amount:", amount);

    // Log Stripe API request details
    console.log("Stripe API Request:", {
      payment_method_types: ["card"],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: currency as string,
          product_data: {
            name: `${item.name} (Size: ${item.size}, Color: ${item.color})`,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      })), // Ensure line_items is an array
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems.map(
        (item: {
          name: string;
          price: number;
          quantity: number;
          size: string;
          color: string;
        }) => ({
          price_data: {
            currency: currency as string, // Explicitly cast currency to string
            product_data: {
              name: `${item.name} (Size: ${item.size}, Color: ${item.color})`, // Include size and color in the product name
            },
            unit_amount: Math.round(item.price * 100), // Ensure unit_amount is an integer
          },
          quantity: item.quantity,
        })
      ),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    console.log("Checkout Session Created:", session);

    // Clear the cart after successful session creation
    cartItems = []; // Reset cartItems to an empty array
    console.log("Cart cleared after successful checkout session creation.");

    return NextResponse.json({
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    console.error("Error details:", {
      cartItems:
        typeof cartItems !== "undefined"
          ? cartItems
          : "cartItems not available",
      currency:
        typeof currency !== "undefined" ? currency : "currency not available",
      error: error instanceof Error ? error.message : String(error),
    });

    // Include error details in the response for debugging
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
