import React from "react";
import "./App.css";
import "./index.scss"
import AppRouter from "./routes";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "primereact/resources/themes/viva-dark/theme.css"
import "primereact/resources/primereact.min.css";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouter />
      </PersistGate>
    </Provider>
  );
}

export default App;
