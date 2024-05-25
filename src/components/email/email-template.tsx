
import { currencyFormat } from '@/utils';

interface EmailTemplateProps {
  firstName: string;
  ordenID: string;
  order: {
    items: Array<{
      productTitle: string;
      productImage: string;
      price: number;
      quantity: number;
      subtotal: number;
    }>;
    address: {
      firstName: string;
      lastName: string;
      address: string;
      address2: string;
      postalCode: string;
      city: string;
      countryId: string;
      phone: string;
    };
    itemsInOrder: number;
    subTotal: number;
    tax: number;
    total: number;
    isPaid: boolean;
  };
  deliveryRange: {
    startDay: number;
    endDay: number;
  };
}

 export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName, 
  ordenID,
  order,
  deliveryRange,
}) => (
  <div>
    <h1>Hola, {firstName}!</h1>
    <p>Gracias por comprar en CodiCown Shop</p>
    <h2>Resumen de tu compra</h2>

    {/* Detalles de la orden */}
    <div>
      <h3>Envío a domicilio</h3>
      <p>{order.address.address} - {order.address.address2}</p>
      <p>{order.address.city}, {order.address.countryId}</p>
      { /*<p>{order.address.postalCode}</p>*/ }
      <p>{order.address.firstName} {order.address.lastName} - {order.address.phone}</p>

      <h3>Pagaste {currencyFormat(order.total)}</h3>
      <p>Vía Paypal</p>

      <h4>Productos</h4>
      {order.items.map(item => (
        <div key={item.productTitle} style={{ marginBottom: '10px' }}>
          <img src={`https://alexdy-pagina-web.vercel.app/_next/image?url=%2Fproducts%2F${item.productImage}&w=256&q=75`} alt={item.productTitle} width={100} height={100} style={{ marginRight: '10px' }} />
          <div>
            <p className="font-bold">{item.productTitle} x {item.quantity}</p>
          </div>
        </div>
      ))}
      <h3>Rango de entrega estimado</h3>
      <p>Tu pedido llegará entre {deliveryRange.startDay} y {deliveryRange.endDay} días.</p>
    </div>

    <button className="bg-sky-500 px-3 py-2">
    <a href={`https://alexdy-pagina-web.vercel.app/orders/${ordenID}`}>Más detalles</a>
    </button>
  </div>
);
