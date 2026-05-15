import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/Store";
import ErrorBoundary from "./services/ErrorBoundary";
import { LanguageProvider, LanguageContext } from "./contexts/LangContext";
import { IntlProvider } from "react-intl";
import App from "./App";

import "./styles/index.css";

const Root = () => {
  const { locale, messages } = React.useContext(LanguageContext);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <App />
    </IntlProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ErrorBoundary fallback={<p>Ha ocurrido un error inesperado.</p>}>
      <LanguageProvider>
        <Root />
      </LanguageProvider>
    </ErrorBoundary>
  </Provider>
);
