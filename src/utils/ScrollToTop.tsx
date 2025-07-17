import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        // Scroll to the top when the page loads or route changes
        window.scrollTo(0, 0)

        // Unfocus any input or button that might auto-focus
        const active = document.activeElement
        if (
            active &&
            ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(active.tagName)
        ) {
            active.blur()
        }

        // Optional: Delay AOS animations to prevent layout shift
        setTimeout(() => {
            if (typeof Aos !== 'undefined') {
                Aos.init({ duration: 500, once: true, mirror: false })
            }
        }, 100)
    }, [pathname]) // Trigger when pathname changes

    return null // This component doesn't render anything
}

export default ScrollToTop
