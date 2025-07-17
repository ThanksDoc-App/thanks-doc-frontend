import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import mockServer from './mock'
import appConfig from '@/configs/app.config'
import './locales'
import ScrollToTop from './utils/ScrollToTop'

const environment = process.env.NODE_ENV

// DISABLE MIRAGEJS COMPLETELY
const DISABLE_MIRAGE = true

if (appConfig.enableMock && !DISABLE_MIRAGE) {
    mockServer({ environment })
    console.log('🟢 MirageJS enabled')
} else {
    console.log('🔴 MirageJS disabled - using real APIs')
}

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <ScrollToTop />
                    <Theme>
                        <Layout />
                    </Theme>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    )
}

export default App
