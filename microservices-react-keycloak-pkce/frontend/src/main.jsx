import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Keycloak from "keycloak-js";
import "./styles.css";
const kc = new Keycloak({ url: "http://localhost:8089", realm: "microservices", clientId: "microservices-ui" });
function App() {
  const [ready, setReady] = useState(false),
    [auth, setAuth] = useState(false),
    [roles, setRoles] = useState([]),
    [result, setResult] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    kc.init({
      onLoad: "check-sso",
      pkceMethod: "S256",
      silentCheckSsoRedirectUri: location.origin + "/silent-check-sso.html",
      checkLoginIframe: false,
    })
      .then((a) => {
        setAuth(a);
        if (a) setRoles(kc.tokenParsed?.realm_access?.roles || []);
        setReady(true);
      })
      .catch(console.error);
  }, []);
  const login = () => kc.login({ redirectUri: location.origin }),
    logout = () => kc.logout({ redirectUri: location.origin });
  async function call(url) {
    setBusy(true);
    try {
      await kc.updateToken(30);
      let r = await fetch(url, { headers: { Authorization: `Bearer ${kc.token}` } });
      setResult(`${r.status} ${r.statusText}\\n\\n${await r.text()}`);
    } catch (e) {
      setResult(String(e));
    } finally {
      setBusy(false);
    }
  }
  if (!ready)
    return (
      <main>
        <h2>Initializing...</h2>
      </main>
    );
  return (
    <main>
      <div className="card">
        <h1>Microservices OAuth2 Demo</h1>
        {!auth ? (
          <>
            <p>Authorization Code + PKCE (S256)</p>
            <button onClick={login}>Login with Keycloak</button>
          </>
        ) : (
          <>
            <p>
              <b>User:</b> {kc.tokenParsed?.preferred_username}
            </p>
            <p>
              <b>Roles:</b> {roles.join(", ")}
            </p>
            <div className="buttons">
              <button onClick={() => call("http://localhost:8080/api/orders/100?productId=1")}>Get Order</button>
              <button onClick={() => call("http://localhost:8080/api/orders/admin/report")}>Admin Report</button>
              <button onClick={() => call("http://localhost:8080/api/products/1")}>Get Product</button>
              <button onClick={() => call("http://localhost:8080/api/products/999")}>Failure Test</button>
              <button onClick={() => call("http://localhost:8080/api/products/888")}>Timeout Test</button>
              <button onClick={logout}>Logout</button>
            </div>
            {busy && <p>Calling...</p>}
            <pre>{result}</pre>
          </>
        )}
      </div>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
