import { useEffect, useState, type FormEvent } from 'react';

const API_URL = 'https://systems-chemistry-binary-duncan.trycloudflare.com';

type RequestType = 'Send' | 'Sale' | 'Other';

type FormState = {
  title: string;
  requestType: RequestType;
  items: string;
  comment: string;
  contactName: string;
  contact: string;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready?: () => void;
        expand?: () => void;
        initDataUnsafe?: {
          user?: unknown;
        };
      };
    };
  }
}

export default function App() {
  const [form, setForm] = useState<FormState>({
    title: '',
    requestType: 'Send',
    items: '',
    comment: '',
    contactName: '',
    contact: '',
  });

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;

    if (webApp) {
      webApp.ready?.();
      webApp.expand?.();
    }
  }, []);

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!form.title.trim() || !form.items.trim() || !form.contact.trim()) {
      setStatus('Заполни название, товары/задачу и контакт.');
      return;
    }

    try {
      setLoading(true);
      setStatus('Отправляю заявку...');

      const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user || null;

      const response = await fetch(`${API_URL}/api/submit-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title,
          type: form.requestType,
          requestType: form.requestType,
          items: form.items,
          comment: form.comment,
          contactName: form.contactName,
          phoneOrUsername: form.contact,
          contact: form.contact,
          telegramUser,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Ошибка отправки');
      }

      setStatus('✅ Заявка отправлена в рабочую группу');

      setForm({
        title: '',
        requestType: 'Send',
        items: '',
        comment: '',
        contactName: '',
        contact: '',
      });
    } catch (error) {
      setStatus(
        `❌ Ошибка: ${
          error instanceof Error ? error.message : 'неизвестная ошибка'
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="card">
        <h1>Telegram Mini App</h1>
        <p className="subtitle">Форма отправки заявки в рабочую группу</p>

        <form onSubmit={handleSubmit}>
          <label>
            Название заявки *
            <input
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Например: Отправить товар"
            />
          </label>

          <label>
            Тип заявки
            <select
              value={form.requestType}
              onChange={(e) =>
                updateField('requestType', e.target.value as RequestType)
              }
            >
              <option value="Send">Отправить</option>
              <option value="Sale">Продажа</option>
              <option value="Other">Другое</option>
            </select>
          </label>

          <label>
            Товары / задача *
            <textarea
              value={form.items}
              onChange={(e) => updateField('items', e.target.value)}
              placeholder={"AIMIKO u2 pro premium 60/45\nWenbox u5 60/45"}
              rows={5}
            />
          </label>

          <label>
            Комментарий
            <textarea
              value={form.comment}
              onChange={(e) => updateField('comment', e.target.value)}
              placeholder="Дополнительная информация"
              rows={3}
            />
          </label>

          <label>
            Имя контакта
            <input
              value={form.contactName}
              onChange={(e) => updateField('contactName', e.target.value)}
              placeholder="Имя"
            />
          </label>

          <label>
            Телефон или Telegram *
            <input
              value={form.contact}
              onChange={(e) => updateField('contact', e.target.value)}
              placeholder="+7... или @username"
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>

        {status && <div className="status">{status}</div>}
      </section>
    </main>
  );
}