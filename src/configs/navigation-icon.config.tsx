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
import setting_icon from '../assets/sidebarIcons/settings-icon.png'
import categoty_icon from '../assets/sidebarIcons/category-icon.png'
import explore_icon from '../assets/sidebarIcons/explore-icon.png'
import jobhistory_icon from '../assets/sidebarIcons/job-history-icon.png'
import business_dashboard from '../assets/sidebarIcons/business-dashboard.png'
import joblisting_icon from '../assets/sidebarIcons/job-listing-icon.png'
import business_icon from '../assets/sidebarIcons/business-icon.png'
import doctor_icon from '../assets/sidebarIcons/doctor-icon.png'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    apps: <HiOutlineViewGridAdd />,
    explore: <img src={explore_icon} alt="Project" className="w-5 h-5" />,
    job_history: <img src={jobhistory_icon} alt="" className="w-5 h-5" />,
    busness_dashboard: (
        <img src={business_dashboard} alt="" className="w-5 h-5" />
    ),
    job_listing: <img src={joblisting_icon} alt="" className="w-5 h-5" />,
    business_icon: <img src={business_icon} alt="" className="w-5 h-5" />,
    doctor_icon: <img src={doctor_icon} alt="" className="w-5 h-5" />,
    category_icon: <img src={categoty_icon} alt="" className="w-5 h-5" />,
    settings_icon: <img src={setting_icon} alt="" className="w-5 h-5" />,
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
