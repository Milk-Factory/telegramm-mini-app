import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { logger } from '../utils/logger'

export interface AuthRequest extends Request {
  telegramUser?: {
    id: number
    first_name: string
    [key: string]: any
  }
}

/**
 * Validate Telegram Mini App init data
 * This middleware verifies that the request comes from a valid Telegram Mini App
 */
export const validateTelegramData = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const initData = req.headers['x-telegram-init-data'] as string

    if (!initData) {
      return res.status(401).json({ error: 'Missing Telegram init data' })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      logger.warn('TELEGRAM_BOT_TOKEN not set, skipping validation')
      return next()
    }

    // Validate init data signature
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')

    if (!hash) {
      return res.status(401).json({ error: 'Invalid Telegram data' })
    }

    params.delete('hash')

    // Create data check string
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    // Verify signature
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    if (calculatedHash !== hash) {
      return res.status(401).json({ error: 'Invalid signature' })
    }

    // Parse user data
    const userParam = params.get('user')
    if (userParam) {
      req.telegramUser = JSON.parse(userParam)
    }

    next()
  } catch (error) {
    logger.error(`Auth middleware error: ${error}`)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default validateTelegramData
