"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { placeOrder} from '@/actions';
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from '@/utils';

export const PlaceOrder = () => {

  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState(null);
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

      console.log("Ya dio ok")

      setErrorMessage(resp.message);
      return;
    }
    
    //* Todo salio bien!
    clearCart();
    router.replace('/orders/' + resp.order?.id )

    setIsPlacingOrder(false);
    setShowPayPalButtons(false);

    console.log("Ya prendio tu");

  };

  const handleCancel = () => {
    console.log("Se cancelo");
    setIsPlacingOrder(true);
    setShowPayPalButtons(true);
  };

  const handlePlaceOrderClick = () => {
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