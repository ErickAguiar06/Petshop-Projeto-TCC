const stripe = Stripe('pk_test_51RkRYN2NDHd3ApIM28O0QMgeTuYzJyVi3xUthi7yEksdPT8ltr2V7BvSPLF1vCGpjl6klHKjktDmECqENQa9wVyp006x4eSinZ');

initialize();

async function initialize() {
  const fetchClientSecret = async () => {
    // Envie o carrinho para o backend
    const carrinhoJSON = localStorage.getItem('carrinho');
    const carrinho = carrinhoJSON ? JSON.parse(carrinhoJSON) : [];
    const response = await fetch("http://localhost:3000/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carrinho }),
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  // Inicializa o checkout embutido
  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Monta o checkout no div
  checkout.mount('#checkout');
}