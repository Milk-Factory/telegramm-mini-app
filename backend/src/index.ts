import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 3000);
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WORK_GROUP_ID = process.env.WORK_GROUP_ID;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors());

app.use(express.json({ limit: '1mb' }));

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    message: 'Backend is working',
  });
});

app.post('/api/submit-request', async (req: Request, res: Response) => {
  try {
    if (!BOT_TOKEN) {
      return res.status(500).json({
        ok: false,
        error: 'BOT_TOKEN is missing in backend .env file',
      });
    }

    if (!WORK_GROUP_ID) {
      return res.status(500).json({
        ok: false,
        error: 'WORK_GROUP_ID is missing in backend .env file',
      });
    }

    const {
      title,
      type,
      requestType,
      items,
      comment,
      contactName,
      phoneOrUsername,
      contact,
      telegramUser,
    } = req.body;

    const finalType = type || requestType || 'Other';
    const finalContact = phoneOrUsername || contact || '';

    if (!title || !items || !finalContact) {
      return res.status(400).json({
        ok: false,
        error: 'Required fields are missing',
      });
    }

    const tgUser = telegramUser || {};

    const message =
      `📩 <b>Новая заявка</b>\n\n` +
      `<b>Пользователь Telegram:</b>\n` +
      `Имя: ${escapeHtml(tgUser.first_name || 'Неизвестно')}\n` +
      `Username: ${escapeHtml(tgUser.username ? '@' + tgUser.username : 'нет username')}\n` +
      `Telegram ID: <code>${escapeHtml(tgUser.id || 'неизвестно')}</code>\n\n` +
      `<b>Заявка:</b>\n` +
      `Тип: ${escapeHtml(finalType)}\n` +
      `Название: ${escapeHtml(title)}\n\n` +
      `<b>Товары / задача:</b>\n${escapeHtml(items)}\n\n` +
      `<b>Комментарий:</b>\n${escapeHtml(comment || '—')}\n\n` +
      `<b>Контакт:</b>\n` +
      `Имя: ${escapeHtml(contactName || '—')}\n` +
      `Телефон / Telegram: ${escapeHtml(finalContact)}`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: WORK_GROUP_ID,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    );

    const telegramData = await telegramResponse.json() as { ok: boolean; description?: string };

    if (!telegramData.ok) {
      return res.status(502).json({
        ok: false,
        error: telegramData.description || 'Telegram API error',
      });
    }

    return res.json({
      ok: true,
    });
  } catch (error) {
    console.error('Submit request error:', error);

    return res.status(500).json({
      ok: false,
      error: 'Internal server error',
    });
  }
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    error: 'Not found',
  });
});

app.listen(PORT, () => {
  console.log(`[INFO] Server is running on port ${PORT}`);
});