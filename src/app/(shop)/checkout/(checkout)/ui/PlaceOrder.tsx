
"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { placeOrder} from '@/actions';
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from '@/utils';
import { getOrderById } from "@/actions/order/get-order-by-id";

export const PlaceOrder = () => {

  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showPayPalButtons, setShowPayPalButtons] = useState(false);

  const address = useAddressStore((state) => state.address);

  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );
  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  function generateRandomDeliveryRange() {
    const minStart = 19;
    const maxStart = 28;
    const startDay = Math.floor(Math.random() * (maxStart - minStart + 1)) + minStart;
    const endDay = startDay + 5;
  
    return { startDay, endDay };
  };

  const sendEmail = async (firstName: string, ordenID: string|undefined, orderDetails: any) => {
    try {
      // Extraer los detalles necesarios de la orden
    const { items, address, subTotal, tax, total } = orderDetails;

    // Generar el rango de entrega aleatorio
    const deliveryRange = generateRandomDeliveryRange();
    const { startDay, endDay } = deliveryRange;


    // Construir los elementos HTML para los artículos
    const itemsHtml = items.map((item: any) => `
      <div style="margin-bottom: 15px;">
      <div>
            <p class="font-bold">${item.product.title} x ${item.quantity}</p>
      </div>
        <div key=${item.product.ProductImage[0].url}" style="margin-bottom: 10px;">
          <img src="https://alexdy-pagina-web.vercel.app/_next/image?url=%2Fproducts%2F${item.product.ProductImage[0].url}&w=256&q=75" alt="${item.product.title}" width="100" height="100" style="margin-right: 10px;" />
        </div>
      </div>
    `).join('');

    // Construir el cuerpo del correo electrónico
    const emailHtml = `
      <div>
        <h1>Hola, ${firstName}!</h1>
        <p>Gracias por comprar en CodiCown Shop</p>
        <h2>Resumen de tu compra</h2>
        <div style="margin-bottom: 20px;">
          <h3>Envío a domicilio</h3>
          <p>${address.address} - ${address.address2}</p>
          <p>${address.city}, ${address.country}</p>
          <p>${address.firstName} ${address.lastName} - ${address.phone}</p>
        </div>
        <div>
        <h3>Pagaste ${currencyFormat(total)}</h3>
        <p>Vía Paypal</p>
        </div>
        <div>
        <h3>Detalles de la orden</h3>
        </div>
        <div style="margin-bottom: 20px;">
          <h4>Productos</h4>
          ${itemsHtml}
        </div>
        <div style="margin-bottom: 20px;">
          <h3>Rango de entrega estimado</h3>
          <p>Tu pedido llegará entre ${startDay} y ${endDay} días a partir de hoy.</p>
        </div>
        <a href="https://alexdy-pagina-web.vercel.app/orders/${ordenID}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 10px;">Más detalles</a>
      </div>`;

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'alex.dilan.2019@gmail.com',
          subject: 'Tu compra está en camino',
          html: emailHtml,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Al final deberia aparecer este');
        console.log('Correo electrónico enviado:', result.message);
      } else {
        console.error('Error al enviar correo electrónico:', result.error);
      }
    } catch (error) {
      console.error('Error al enviar correo electrónico:', error);
    }
  };

  const handleApprove = async () => {

    console.log("empezo bien")

    const productsToOrder = cart.map(product => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }))

    console.log("Ya se resto")

     //! Server Action
    const resp = await placeOrder(productsToOrder, address);
    if (!resp.ok) {

      console.log("No dio ok")

      setErrorMessage(resp.message);
      return;
    }
    
    console.log(resp.order?.id)
    console.log(address.firstName)
    
    //* Todo salio bien!
    clearCart();
    router.replace('/orders/' + resp.order?.id )
    setIsPlacingOrder(false);
    setShowPayPalButtons(false);

    //enviar email-----------------------------
    const { ok, order } = await getOrderById(resp.order?.id || "");
    await sendEmail(address.firstName, resp.order?.id, {
      items: order?.OrderItem,
      address,
      subTotal: order?.subTotal,
      tax: order?.tax,
      total: order?.total,
    });
    //-----------------------------------------

    console.log("Ya prendio tu");

  };

  const handleCancel = () => {
    console.log("Se cancelo");
    setIsPlacingOrder(true);
    setShowPayPalButtons(true);
  };

  const handlePlaceOrderClick = async () => {
    setIsPlacingOrder(true);
    setShowPayPalButtons(true);
  };

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Resumen de orden</h2>

      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">
          {currencyFormat(total)}
        </span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          <span className="text-xs">
            Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros{" "}
            <a href="#" className="underline">
              términos y condiciones
            </a>{" "}
            y{" "}
            <a href="#" className="underline">
              política de privacidad
            </a>
          </span>
        </p>

        <p className="text-red-500">{errorMessage}</p>

        <button
          onClick={handlePlaceOrderClick}
          className={clsx({
            'btn-primary': !isPlacingOrder,
            'btn-disabled': isPlacingOrder
          })}
        >
          Colocar orden
        </button>
      </div>

      {showPayPalButtons && (
        <PayPalScriptProvider options={{
          clientId:"Ab9NIe_DMyUmuLfbj4A0HyNe92Y081Cnm4uec9EHVNeJyir20aacWECDXwD72hvWv-DL24LtKv0CNdHE"
        }}>
          <PayPalButtons
            style={{
              layout: "horizontal", 
              color: "silver" 
            }}
            createOrder={async (data, actions) => {
              const res = await fetch('/api/checkout', {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  total,
                  description: `${itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}`
                })
              });
              const order = await res.json();
              console.log(order);
              return order.id;
            }}
            onCancel={ (data) => {
              handleCancel();
            }}
            onApprove={async (data, actions) => {
              await actions.order?.capture();
              handleApprove();
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};