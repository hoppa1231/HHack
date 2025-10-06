import { useState } from "react";
import { api } from "../api/news";
import { auth } from "../shared/auth";
import { useNavigate } from "react-router-dom";

// Типы категорий
const CATEGORIES = [
  'политика', 'экономика', 'спорт', 'технологии', 
  'культура', 'наука', 'здоровье', 'развлечения', 'другое'
] as const;

type CategoryType = typeof CATEGORIES[number];

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [preferences, setPreferences] = useState<CategoryType[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  const togglePreference = (category: CategoryType) => {
    setPreferences(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const { access_token } = await api.login({ 
        name, 
        password, 
        preferences 
      });
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

      {/* Блок выбора категорий */}
      <div className="border rounded p-3">
        <h3 className="text-sm font-medium mb-2">Интересы (необязательно)</h3>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map(category => (
            <label key={category} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={preferences.includes(category)}
                onChange={() => togglePreference(category)}
                className="rounded"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">
        Войти
      </button>
      
      {err && <p className="text-sm text-red-500">{err}</p>}
    </form>
  );
}