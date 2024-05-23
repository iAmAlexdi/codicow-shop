import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email/email-template';
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend('re_jAdh7HNY_No9goi1Agy2tAEwnmU2TpbJX');

export async function POST( request: NextRequest ) {

  console.log("Esta vivo!");

  try {

    const { ordenID, firstName } = await request.json();

    console.log("el order id es: " + ordenID);
    console.log("el nombre es: " + firstName);

    const data = await resend.emails.send({
      from: 'codicownteam@resend.dev',
      to: ['iamalexdy@gmail.com'],
      subject: 'Tu compra con id '+ ordenID +'  está en camino',
      react: EmailTemplate({ firstName, ordenID }),  // Asume que EmailTemplate recibe orderId
      text: `Tu orden con ID {orderId} está en camino.`,
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
