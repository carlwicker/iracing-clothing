const PRINTFUL_API = "https://api.printful.com";

export async function createPrintfulOrder(
  imageUrl: string,
  metadata: { timecode: string; camera: string }
) {
  const res = await fetch(`${PRINTFUL_API}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient: {
        name: "John Test",
        address1: "123 Print Lane",
        city: "Los Angeles",
        state_code: "CA",
        country_code: "US",
        zip: "90001",
        email: "test@example.com",
      },
      items: [
        {
          variant_id: 4012, // Gildan 64000 Unisex T-Shirt - White - M
          quantity: 1,
          files: [
            {
              url: imageUrl, // This is the image you generate
            },
          ],
          name: `Custom Replay Shirt (${metadata.camera} @ ${metadata.timecode})`,
        },
      ],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Printful order failed");
  return data;
}
