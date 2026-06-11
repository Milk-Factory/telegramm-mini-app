import { useEffect, useState } from 'react'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  sendData: (data: string) => void
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    [key: string]: any
  }
  themeParams: {
    bg_color: string
    secondary_bg_color: string
    text_color: string
    hint_color: string
    link_color: string
    button_color: string
    button_text_color: string
  }
}

export const useTelegram = () => {
  const [tg, setTg] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const TgWebApp = (window as any).Telegram?.WebApp

    if (TgWebApp) {
      TgWebApp.ready()
      TgWebApp.expand()

      setTg(TgWebApp)
      setUser(TgWebApp.initDataUnsafe.user || null)
      setIsReady(true)

      // Set theme
      if (TgWebApp.themeParams) {
        const root = document.documentElement
        root.style.setProperty('--bg-color', TgWebApp.themeParams.bg_color)
        root.style.setProperty('--text-color', TgWebApp.themeParams.text_color)
      }
    } else {
      // Fallback for development
      console.warn('Telegram WebApp is not available')
      setIsReady(true)
    }
  }, [])

  return { tg, user, isReady }
}
