import { useState } from "react";
import { api } from "../api/news";
import { auth } from "../shared/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [preferences, setPreferences] = useState<string>(""); // через запятую
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const prefs = preferences.split(",").map(s=>s.trim()).filter(Boolean);
      const { access_token } = await api.register({ name, preferences: prefs });
      auth.set(access_token);
      nav("/news");
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Register failed");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="name" required />
      <input value={preferences} onChange={e=>setPreferences(e.target.value)} placeholder="prefs: sport,tech,..." />
      <button type="submit">Create</button>
      {err && <p style={{color:"crimson"}}>{err}</p>}
    </form>
  );
}
