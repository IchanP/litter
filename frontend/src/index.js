import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

// style
import "./style/index.css"

// miljövariabler för domän och client_id
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

// omdirigering hit efter inlogg
const redirectUri = `${window.location.origin}/home`;

const root = createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: redirectUri,
      audience: audience,
      scope: "openid profile email read:users read:current_user read:user_idp_tokens"
    }}
  >
    <App />
  </Auth0Provider>,
);