import { useEffect, useState } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { api } from '../utils/api'
import './Home.css'

export default function Home() {
  const { user, tg } = useTelegram()
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleGetStatus = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/status')
      setMessage(`Server Status: ${response.data.status}`)
    } catch (error) {
      setMessage('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  const handleSendData = () => {
    if (tg?.sendData) {
      tg.sendData('mini_app_data')
      setMessage('Data sent to Telegram!')
    }
  }

  return (
    <div className="home">
      <div className="card">
        <h2>Welcome{user ? `, ${user.first_name}` : ''}!</h2>
        <p>This is your Telegram Mini App</p>

        {user && (
          <div className="user-info">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username || 'N/A'}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Actions</h3>
        <button 
          onClick={handleGetStatus} 
          disabled={loading}
          className="button button-primary"
        >
          {loading ? 'Loading...' : 'Check Server Status'}
        </button>
        <button 
          onClick={handleSendData}
          className="button button-secondary"
        >
          Send Data to Telegram
        </button>
      </div>

      {message && (
        <div className="card message-card">
          <p>{message}</p>
        </div>
      )}
    </div>
  )
}
