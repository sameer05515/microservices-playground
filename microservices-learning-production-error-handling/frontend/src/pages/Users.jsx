import { useEffect, useState } from "react";
import { userApi } from "../api/api";
export default function Users() {
  const [users, setUsers] = useState([]),
    [form, setForm] = useState({ name: "", email: "" }),
    [msg, setMsg] = useState("");
  const load = async () => {
    try {
      setUsers((await userApi.list()).data);
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
      await userApi.create(form);
      setForm({ name: "", email: "" });
      setMsg("User created successfully.");
      load();
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
    }
  };
  return (
    <section>
      <h2>Users</h2>
      <p>Create users through the API Gateway.</p>
      <form className="card form" onSubmit={create}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button>Create User</button>
      </form>
      {msg && <div className="msg">{msg}</div>}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="mono">{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!users.length && <p className="muted">No users found.</p>}
      </div>
    </section>
  );
}
