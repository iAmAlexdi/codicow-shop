"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import ReCAPTCHA from 'react-google-recaptcha';

import { authenticate } from "@/actions";
import { IoInformationOutline } from "react-icons/io5";
import clsx from 'clsx';

export const LoginForm = () => {
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [state, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    if (state === 'Success') {
      window.location.replace('/');
    }
  }, [state]);

  useEffect(() => {
    if (state === 'CredentialsSignin') {
      // Reset recaptcha if login fails
      setRecaptchaToken('');
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  }, [state]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('recaptchaToken', recaptchaToken);
    dispatch(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        name="email"
        required
      />

      <label htmlFor="password">Contraseña</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
        name="password"
        required
      />

      <ReCAPTCHA
        sitekey="6LeAAPYpAAAAALIYas0IzueP4x03Aa0Wr9mHVmZy"
        onChange={(token) => setRecaptchaToken(token || '')}
        ref={recaptchaRef}
      />

      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {state === "CredentialsSignin" && (
          <div className="flex flex-row mb-2">
            <IoInformationOutline className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">
              Credenciales no son correctas
            </p>
          </div>
        )}
      </div>

      <LoginButton recaptchaToken={recaptchaToken} pending={useFormStatus().pending} />
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>
    </form>
  );
};

function LoginButton({ recaptchaToken, pending }: { recaptchaToken: string, pending: boolean }) {
  return (
    <button 
      type="submit" 
      className={clsx({
        "btn-primary": !pending && recaptchaToken,
        "btn-disabled": pending || !recaptchaToken
      })}
      disabled={pending || !recaptchaToken}
    >
      Ingresar
    </button>
  );
}
