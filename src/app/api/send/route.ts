import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email/email-template';
import { NextRequest, NextResponse } from "next/server";

import { getOrderById } from "@/actions/order/get-order-by-id";

const resend = new Resend('re_jAdh7HNY_No9goi1Agy2tAEwnmU2TpbJX');

function generateRandomDeliveryRange() {
  const minStart = 19;
  const maxStart = 28;
  const startDay = Math.floor(Math.random() * (maxStart - minStart + 1)) + minStart;
  const endDay = startDay + 5;

  return { startDay, endDay };
}

export async function POST( request: NextRequest ) {

  console.log("Esta vivo!");

  try {

    const { ordenID, firstName } = await request.json();

    console.log("el order id es: " + ordenID);
    console.log("el nombre es: " + firstName);

    const { ok, order } = await getOrderById(ordenID);

    if (!ok) {
      console.log("No dio ok al recivir los datos para el email")
      message: "No dio ok al recivir los datos para el email"
    }

    const deliveryRange = generateRandomDeliveryRange();

    const emailData = {
      firstName,
      ordenID,
      order: {
        items: order?.OrderItem?.map(item => ({
          productTitle: item.product.title,
          productImage: item.product.ProductImage[0].url,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })) || [],
        address: {
          firstName: order?.OrderAddress?.firstName || "",
          lastName: order?.OrderAddress?.lastName || "",
          address: order?.OrderAddress?.address || "",
          address2: order?.OrderAddress?.address2 || "",
          postalCode: order?.OrderAddress?.postalCode || "",
          city: order?.OrderAddress?.city || "",
          countryId: order?.OrderAddress?.countryId || "",
          phone: order?.OrderAddress?.phone || ""
        },
        itemsInOrder: order?.itemsInOrder || 0,
        subTotal: order?.subTotal || 0,
        tax: order?.tax || 0,
        total: order?.total || 0,
        isPaid: order?.isPaid || false,
      },
      deliveryRange, // Agregar el rango de entrega
    };

    const data = await resend.emails.send({
      from: 'codicownteam@resend.dev',
      to: ['iamalexdy@gmail.com'],
      subject: 'Tu compra está en camino',
      react: EmailTemplate( emailData ),  // Asume que EmailTemplate recibe orderId
      text: "",
    });
    console.log(data);

    return NextResponse.json({
      message: "Email Enviado"
     },{
      status: 200,
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ 
      message: "Error"
     },{
      status: 500,
     }
    );
  }
}
