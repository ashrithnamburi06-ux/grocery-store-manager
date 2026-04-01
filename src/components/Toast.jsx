import { useEffect, useState } from 'react'

export default function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onDone?.()
    }, 2700)
    return () => clearTimeout(timer)
  }, [onDone])

  if (!visible) return null
  return <div className="toast" role="alert">{message}</div>
}
