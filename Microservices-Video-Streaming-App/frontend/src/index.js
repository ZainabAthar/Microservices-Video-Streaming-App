import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { AuthProvider } from "react-auth-kit";
import { Provider } from 'react-redux';
import { store } from "./store/store";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider
    authType={"cookie"}
    authName={"_auth"}
    cookieDomain={window.location.hostname}
    cookieSecure={false}
  >
    
<Provider store={store}>
      <App />
 </Provider>
  </AuthProvider>
);