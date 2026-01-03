import { useEffect, useState } from "react";
import { orderApi, productApi, userApi } from "../api/api";
export default function Orders() {
  const [u, setU] = useState([]),
    [p, setP] = useState([]),
    [o, setO] = useState([]),
    [f, setF] = useState({ userId: "", productId: "", quantity: 1 }),
    [msg, setMsg] = useState("");
  const load = async () => {
    try {
      const [a, b, c] = await Promise.all([userApi.list(), productApi.list(), orderApi.list()]);
      setU(a.data);
      setP(b.data);
      setO(c.data);
      setF((x) => ({ ...x, userId: x.userId || a.data[0]?.id || "", productId: x.productId || b.data[0]?.id || "" }));
    } catch (e) {
      setMsg(e.message);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const create = async (e) => {
    e.preventDefault();
    try {
      await orderApi.create({ ...f, quantity: Number(f.quantity) });
      setMsg("Order created successfully. Product stock was reduced.");
      load();
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
    }
  };
  return (
    <section>
      <h2>Orders</h2>
      <p>Order Service calls User and Product Services using OpenFeign.</p>
      <form className="card form" onSubmit={create}>
        <select value={f.userId} onChange={(e) => setF({ ...f, userId: e.target.value })} required>
          <option value="">Select user</option>
          {u.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name} — {x.email}
            </option>
          ))}
        </select>
        <select value={f.productId} onChange={(e) => setF({ ...f, productId: e.target.value })} required>
          <option value="">Select product</option>
          {p.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name} — ₹{x.price} — stock {x.stock}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={f.quantity}
          onChange={(e) => setF({ ...f, quantity: e.target.value })}
          required
        />
        <button disabled={!f.userId || !f.productId}>Create Order</button>
      </form>
      {msg && <div className="msg">{msg}</div>}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {o.map((x) => (
              <tr key={x.id}>
                <td className="mono">{x.id}</td>
                <td className="mono">{x.userId}</td>
                <td className="mono">{x.productId}</td>
                <td>{x.quantity}</td>
                <td>₹{Number(x.totalPrice).toLocaleString("en-IN")}</td>
                <td>
                  <span className="badge">{x.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!o.length && <p className="muted">No orders found.</p>}
      </div>
    </section>
  );
}
