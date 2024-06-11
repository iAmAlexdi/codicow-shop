'use server';

import { signIn } from '@/auth.config';
import axios from 'axios';

const recaptchaSecretKey = '6LeAAPYpAAAAAJstBOPOy7xbWrTJFirlmPO5ufEY';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const recaptchaToken = formData.get('recaptchaToken');
    if (!recaptchaToken) {
      return 'NoReCAPTCHAToken';
    }

    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      {},
      {
        params: {
          secret: recaptchaSecretKey,
          response: recaptchaToken,
        },
      }
    );

    if (!recaptchaResponse.data.success) {
      return 'InvalidReCAPTCHA';
    }

    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return 'Success';
  } catch (error) {
    console.log(error);
    return 'CredentialsSignin';
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn('credentials', { email, password });
    return { ok: true };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo iniciar sesión'
    };
  }
};
