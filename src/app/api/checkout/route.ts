
import { NextRequest, NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";

// Creating an environment
const clientId = "Ab9NIe_DMyUmuLfbj4A0HyNe92Y081Cnm4uec9EHVNeJyir20aacWECDXwD72hvWv-DL24LtKv0CNdHE";
const clientSecret = "EIob9HHwSmVywozG_a0F6OCOvANpqjY7Sj5C7h6xoDlFJtmAAWRVTl1cOlx2KuAFTd20xEefg6mfxAVn";


const credentialsSB = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(credentialsSB);


export async function POST(request: NextRequest) {
  console.log("El POST funciona correctamente");

  const { total, description } = await request.json();

  const requestPayPal = new paypal.orders.OrdersCreateRequest();
  requestPayPal.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total.toString(),
        },
        description: "Usted adquirio " + description + " de CodiCown Shop",
      },
    ],
  });

  const response = await client.execute(requestPayPal);
  console.log(response);

  return NextResponse.json({
    id: response.result.id,
  });
}