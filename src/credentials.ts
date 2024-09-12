require("dotenv").config();
const serviceAccount = {
  type: process.env.TYPE as string,
  project_id: process.env.PROJECT_ID as string,
  private_key_id: process.env.PRIVATE_KEY_ID as string,
  private_key: process.env.PRIVATE_KEY as string,
  client_email: process.env.CLIENT_EMAIL as string,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI as string,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER as string,
  client_x509_cert_url: process.env.CLIENT__CERT_URL as string,
  universe_domain: process.env.UNIVERSE_DOMAIN as string,
};
const aa = JSON.stringify(serviceAccount);
export const serviceAccountJson = JSON.parse(aa);
