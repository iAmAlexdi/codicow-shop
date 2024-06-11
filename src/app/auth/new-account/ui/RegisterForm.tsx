"use client";

import clsx from 'clsx';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';

import ReCAPTCHA from 'react-google-recaptcha';

import { login, registerUser } from '@/actions';
import { useState, useRef  } from 'react';


type FormInputs = {
  name: string;
  email: string;
  password: string;  
}



export const RegisterForm = () => {

  const [errorMessage, setErrorMessage] = useState('')
  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm<FormInputs>();
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const onSubmit: SubmitHandler<FormInputs> = async(data) => {
    setErrorMessage('');
    const { name, email, password } = data;
    
    // Server action
    const resp = await registerUser(name, email, password, recaptchaToken);

    if (!resp.ok) {
      setErrorMessage(resp.message);
      setRecaptchaToken('');
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      return;
    }

    await login( email.toLowerCase(), password );
    window.location.replace('/');
  }

  const handleFormSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      recaptchaRef.current?.execute();
    }
  };

  return (
    <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>

      {/* {
        errors.name?.type === 'required' && (
          <span className="text-red-500">* El nombre es obligatorio</span>
        )
      } */}


      <label htmlFor="email">Nombre completo</label>
      <input
        className={
          clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-5",
            {
              'border-red-500': errors.name
            }
          )
        }
        type="text"
        autoFocus
        { ...register('name', { required: true }) }
      />

      <label htmlFor="email">Correo electrónico</label>
      <input
        className={
          clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-5",
            {
              'border-red-500': errors.email
            }
          )
        }
        type="email"
        { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) }
      />

      <label htmlFor="email">Contraseña (Minimo 8 carcateres)</label>
      <input
        className={
          clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-5",
            {
              'border-red-500': errors.password
            }
          )
        }
        type="password"
        { ...register('password', { required: true, minLength: 0 }) }
      />

      <ReCAPTCHA
        sitekey="6LeKqvYpAAAAAJ0Y7lczUVSlbVhPAuCJ5364pJZX"
        size="invisible"
        onChange={(token) => {
          setRecaptchaToken(token || '');
          const formData = getValues();
          onSubmit(formData);
        }}
        ref={recaptchaRef}
      />
      
      <span className="text-red-500">{ errorMessage } </span>
        
      

      <button className="btn-primary" onClick={handleFormSubmit}>
        Crear cuenta
      </button>

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Ingresar
      </Link>
    </form>
  );
};
