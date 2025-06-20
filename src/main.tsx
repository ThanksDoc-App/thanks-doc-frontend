import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 🔔 Import Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// 🛑 COMPLETELY DISABLE MIRAGEJS
console.log('🛑 MirageJS completely disabled')

const shutdownMirage = () => {
    const win = window as any

    if (win.server) {
        console.log('🛑 Shutting down MirageJS server instance')
        try {
            win.server.shutdown()
            delete win.server
        } catch (e) {
            console.log('Error shutting down server:', e)
        }
    }

    if (win.miragejs && win.miragejs.server) {
        console.log('🛑 Shutting down MirageJS namespace server')
        try {
            win.miragejs.server.shutdown()
            delete win.miragejs.server
        } catch (e) {
            console.log('Error shutting down miragejs server:', e)
        }
    }

    if (win.miragejs) {
        win.miragejs.createServer = () => {
            console.log('🚫 MirageJS createServer call blocked')
            return {
                shutdown: () => {},
                namespace: '',
                urlPrefix: '',
                passthrough: () => {},
                get: () => {},
                post: () => {},
                put: () => {},
                delete: () => {},
                patch: () => {},
            }
        }
    }
}

shutdownMirage()
setTimeout(shutdownMirage, 100)

console.log('✅ MirageJS disabled - all API calls will go to real endpoints')

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <>
            <App />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    </React.StrictMode>,
)
