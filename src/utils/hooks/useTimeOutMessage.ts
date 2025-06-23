import { useEffect, useState } from 'react'

function useTimeOutMessage(interval = 10000): [string, React.Dispatch<React.SetStateAction<string>>] {
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (message) {
            const timeout = setTimeout(() => setMessage(''), interval)
            return () => clearTimeout(timeout)
        }
    }, [message, interval])

    return [message, setMessage]
}

export default useTimeOutMessage
