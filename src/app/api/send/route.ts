
import { NextRequest, NextResponse } from "next/server";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: 'codicownteam@gmail.com',
    pass: 'whfo tqqs zmco kkpl',
  },
});

export async function POST(request: NextRequest) {
  try {
    console.log("Aqui entra primero")
    const { to, subject, html } = await request.json();

    const mailOptions = {
      from: '"CodiCownTeam" <codicownteam@gmail.com>',
      to,
      subject,
      html,
    };

    console.log(to)

    await transporter.sendMail(mailOptions);
    console.log("luego aqui entra")
    return NextResponse.json({ message: 'Correo electrónico enviado' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}