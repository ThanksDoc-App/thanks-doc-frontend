import {
    HiOutlineChartSquareBar,
    HiOutlineUserGroup,
    HiOutlineTrendingUp,
    HiOutlineUserCircle,
    HiOutlineBookOpen,
    HiOutlineCurrencyDollar,
    HiOutlineShieldCheck,
    HiOutlineColorSwatch,
    HiOutlineChatAlt,
    HiOutlineDesktopComputer,
    HiOutlinePaperAirplane,
    HiOutlineChartPie,
    HiOutlineUserAdd,
    HiOutlineKey,
    HiOutlineBan,
    HiOutlineHand,
    HiOutlineDocumentText,
    HiOutlineTemplate,
    HiOutlineLockClosed,
    HiOutlineDocumentDuplicate,
    HiOutlineViewGridAdd,
    HiOutlineShare,
    HiOutlineVariable,
    HiOutlineCode,
} from 'react-icons/hi'
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    apps: <HiOutlineViewGridAdd />,
    explore: (
        <img
            src="/public/img/sidebarIcons/explore-icon.png"
            alt="Project"
            className="w-5 h-5"
        />
    ),
    job_history: (
        <img
            src="/public/img/sidebarIcons/job-history-icon.png"
            alt=""
            className="w-5 h-5"
        />
    ),
    busness_dashboard: (
        <img
            src="/public/img/sidebarIcons/business-dashboard.png"
            alt=""
            className="w-5 h-5"
        />
    ),
    job_listing: (
        <img
            src="/public/img/sidebarIcons/job-listing-icon.png"
            alt=""
            className="w-5 h-5"
        />
    ),
    business_icon: (
        <img
            src="/public/img/sidebarIcons/business-icon.png"
            alt=""
            className="w-5 h-5"
        />
    ),
    doctor_icon: (
        <img
            src="/public/img/sidebarIcons/doctor-icon.png"
            alt=""
            className="w-5 h-5"
        />
    ),
    category_icon: (
        <img
            src="/public/img/sidebarIcons/category-icon.png"
            alt=""
            className="w-5 h-5"
        />
    ),
    settings_icon: (
        <img
            src="/public/img/sidebarIcons/settings-icon.png"
            alt=""
            className="w-5 h-5"
        />
    ),
    knowledgeBase: <HiOutlineBookOpen />,
    account: <HiOutlineUserCircle />,
    uiComponents: <HiOutlineTemplate />,
    common: <HiOutlineColorSwatch />,
    feedback: <HiOutlineChatAlt />,
    dataDisplay: <HiOutlineDesktopComputer />,
    forms: <HiOutlineDocumentText />,
    navigation: <HiOutlinePaperAirplane />,
    graph: <HiOutlineChartPie />,
    authentication: <HiOutlineLockClosed />,
    signIn: <HiOutlineShieldCheck />,
    signUp: <HiOutlineUserAdd />,
    forgotPassword: <HiOutlineLockClosed />,
    resetPassword: <HiOutlineKey />,
    pages: <HiOutlineDocumentDuplicate />,
    welcome: <HiOutlineHand />,
    accessDenied: <HiOutlineBan />,
    guide: <HiOutlineBookOpen />,
    documentation: <HiOutlineDocumentText />,
    sharedComponentDoc: <HiOutlineShare />,
    utilsDoc: <HiOutlineVariable />,
    changeLog: <HiOutlineCode />,
}

export default navigationIcon
