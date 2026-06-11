# Telegram Mini App

A full-stack Telegram Mini App built with React + TypeScript (frontend) and Express + TypeScript (backend).

## Project Structure

```
telegram-mini-app/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── App.tsx        # Main App component
│   │   └── main.tsx       # Entry point
│   ├── public/            # Static files
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/               # Express + TypeScript
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript type definitions
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend will be available at `http://localhost:3000`

## Development

### Frontend Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Run production build
- `npm run lint` - Run ESLint

## Environment Variables

### Frontend (.env or .env.local)

```
VITE_API_URL=http://localhost:3000
```

### Backend (.env)

```
PORT=3000
NODE_ENV=development
TELEGRAM_BOT_TOKEN=your_bot_token_here
ALLOWED_ORIGINS=http://localhost:5173
```

## API Endpoints

### Status
- `GET /api/status` - Get server status

### Data
- `POST /api/data` - Submit data to the server

### Telegram Webhook
- `POST /api/telegram/webhook` - Telegram webhook endpoint

## Telegram Mini App Setup

To use this as a Telegram Mini App:

1. Create a bot using [@BotFather](https://t.me/botfather)
2. Set the Mini App URL to your frontend deployment URL
3. Update `TELEGRAM_BOT_TOKEN` in backend `.env`
4. Deploy frontend and backend to your hosting

## Features

- ✅ React + TypeScript frontend
- ✅ Express + TypeScript backend
- ✅ Telegram WebApp API integration
- ✅ Type-safe development
- ✅ CORS support
- ✅ Custom hooks for Telegram integration
- ✅ Logger utility
- ✅ Request/response interceptors

## Project Customization

### Adding New API Endpoints

Edit `backend/src/routes/index.ts`:

```typescript
router.get('/api/custom', (req: Request, res: Response) => {
  res.json({ message: 'Your response' })
})
```

### Adding New Components

Create in `frontend/src/components/` and import in your pages.

### Database Integration

The project currently has no database. To add one:

1. Install database driver (e.g., `mongodb`, `pg`)
2. Create a connection file
3. Create models/schemas
4. Use in your routes

## Deployment

### Frontend (Vercel, Netlify, etc.)

```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku, Railway, AWS Lambda, etc.)

```bash
npm run build
npm start
```

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
