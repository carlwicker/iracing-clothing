import { NextResponse } from "next/server";

export async function GET() {
  // Mock data for orders
  const orders = [
    { id: 1, item: "T-shirt", quantity: 2 },
    { id: 2, item: "Hoodie", quantity: 1 },
  ];

  return NextResponse.json(orders);
}

export async function DELETE() {
  // Logic to delete orders (mock implementation)
  return NextResponse.json({ message: "Order deleted successfully" });
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log("New Order:", body);

  return NextResponse.json({ message: "Order created successfully" });
}
