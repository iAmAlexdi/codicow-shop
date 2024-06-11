'use server';

import prisma from '@/lib/prisma';
import bcryptjs from 'bcryptjs';
import axios from 'axios';

const RECAPTCHA_SECRET_KEY = '6LeKqvYpAAAAAOxI8zQZ8RBLD8Gg3-1ReLsuPyUA';

export const registerUser = async (name: string, email: string, password: string, recaptchaToken: string) => {
  
  try {

    // Verificar reCAPTCHA
    const recaptchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: recaptchaToken
      }
    });


    // Validar la contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$%#_*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return {
        ok: false,
        message: 'La contraseña debe tener al menos 8 caracteres y contener al menos una mayúscula, una minúscula, un número y un carácter especial entre ($, %, #, _, *)',
      };
    }

    // Validar el correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/;
    if (!emailRegex.test(email)) {
      return {
        ok: false,
        message: 'El correo electrónico proporcionado no es válido, debe tener un dominio valido (ejemplo@gmail.com)',
      };
    }

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: bcryptjs.hashSync(password),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      ok: true,
      user: user,
      message: 'Usuario creado',
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo crear el usuario',
    };
  }
};