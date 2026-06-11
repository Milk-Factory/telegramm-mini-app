import { Router, Request, Response } from 'express'
import { logger } from '../utils/logger'

const router = Router()

// API status endpoint
router.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Example API endpoint
router.post('/api/data', (req: Request, res: Response) => {
  try {
    const { data } = req.body

    if (!data) {
      return res.status(400).json({ error: 'Data is required' })
    }

    logger.info(`Received data: ${JSON.stringify(data)}`)

    res.json({
      success: true,
      message: 'Data received successfully',
      data: data,
    })
  } catch (error) {
    logger.error(`Error processing data: ${error}`)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Telegram webhook endpoint (optional)
router.post('/api/telegram/webhook', (req: Request, res: Response) => {
  try {
    const update = req.body

    logger.info(`Telegram webhook received: ${JSON.stringify(update)}`)

    // Process Telegram updates here
    res.json({ ok: true })
  } catch (error) {
    logger.error(`Webhook error: ${error}`)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

export default router
