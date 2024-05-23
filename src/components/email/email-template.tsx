interface EmailTemplateProps {
  firstName: string;
  ordenID: string;
}

 export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName, ordenID,
}) => (
  <div>
    <h1>Hola, {firstName}!</h1>
    <h2>Gracias por tu compra, te mostraremos los detalles de tu pedido</h2>

    <p>Esto es una prueba del email-template</p>
    <p>Tu número de orden es: { ordenID }</p>
    <button className="bg-sky-500 px-3 py-2">
        <a href='https://alexdy-pagina-web.vercel.app/orders'>Go to CodiCown</a>
    </button>
  </div>
);
