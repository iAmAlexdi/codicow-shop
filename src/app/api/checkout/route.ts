import { NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";

// Creating an environment
const clientId = "Ab9NIe_DMyUmuLfbj4A0HyNe92Y081Cnm4uec9EHVNeJyir20aacWECDXwD72hvWv-DL24LtKv0CNdHE";
const clientSecret = "EIob9HHwSmVywozG_a0F6OCOvANpqjY7Sj5C7h6xoDlFJtmAAWRVTl1cOlx2KuAFTd20xEefg6mfxAVn";

const credentialsSB = new paypal.core.SandboxEnvironment(clientId, clientSecret);


const client = new paypal.core.PayPalHttpClient(credentialsSB);

export async function POST() {
  
  console.log("El POST funciona correctamente");

  const request = new paypal.orders.OrdersCreateRequest();

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "9.99",
        },
        description: "Esta comprando en la tienda CodiCown"
      },
    ],
  });

  const response = await client.execute(request);
  console.log(response);

  return NextResponse.json({
    id: response.result.id,
  });
}