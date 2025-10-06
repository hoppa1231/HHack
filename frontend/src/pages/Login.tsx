import { useState } from "react";
import { api } from "../api/news";
import { auth } from "../shared/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const { access_token } = await api.login({ name, password });
      auth.set(access_token);
      nav("/news");
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Не удалось войти");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-semibold text-center">Вход</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя пользователя"
        required
        className="border rounded px-3 py-2"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        type="password"
        required
        className="border rounded px-3 py-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">
        Войти
      </button>
      {err && <p className="text-sm text-red-500">{err}</p>}
    </form>
  );
}

