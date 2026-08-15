export const environnement = process.env.NODE_ENV;

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

export { apiUrl, stripePublicKey };
