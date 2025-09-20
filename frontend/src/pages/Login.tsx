import { useState } from "react";
import { api } from "../api/news";
import { auth } from "../shared/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const { access_token } = await api.login({ name });
      auth.set(access_token);
      nav("/news");
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Login failed");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="name" required />
      <button type="submit">Sign in</button>
      {err && <p style={{color:"crimson"}}>{err}</p>}
    </form>
  );
}
