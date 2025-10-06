import { useState } from "react";
import { api } from "../api/news";
import { auth } from "../shared/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [preferences, setPreferences] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const prefs = preferences
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const { access_token } = await api.register({ name, password, preferences: prefs });
      auth.set(access_token);
      nav("/news");
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Не удалось зарегистрироваться");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-semibold text-center">Регистрация</h2>
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
      <input
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
        placeholder="Интересы: спорт, технологии"
        className="border rounded px-3 py-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">
        Создать аккаунт
      </button>
      {err && <p className="text-sm text-red-500">{err}</p>}
    </form>
  );
}

