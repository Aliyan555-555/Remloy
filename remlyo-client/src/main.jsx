import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "./index.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RdyBFQ2l1oorLYrozyhfQZ1m2nI80YEUU4d910z0bwOIdyhOY0pyDQInYtYJbYHXJcJxLFzWaHISuUGRW56aWeq00qdShyWiG"
);
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </MantineProvider>
    </BrowserRouter>
  </QueryClientProvider>
  // </React.StrictMode>,
);
