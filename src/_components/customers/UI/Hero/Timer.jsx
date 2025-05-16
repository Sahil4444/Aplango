"use client"

import { useState, useEffect } from "react"

export function Timer({ initialSeconds, onExpire }) {
  const [seconds, setSeconds] = useState(initialSeconds || 0)

  useEffect(() => {
    if (seconds <= 0) {
      onExpire()
      return
    }

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(interval)
          onExpire()
          return 0
        }
        return prevSeconds - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [seconds, onExpire])

  const formatTime = () => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    const pad = (num) => num.toString().padStart(2, "0")

    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`
  }

  return <span>Expires in {formatTime()}</span>
}
