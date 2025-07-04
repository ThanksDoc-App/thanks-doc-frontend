import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { useAppDispatch, signOutSuccess, setUser } from '@/store'
import { useNavigate, Link } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import classNames from 'classnames'
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi'
import { FiActivity } from 'react-icons/fi'
import type { CommonProps } from '@/@types/common'
import type { JSX } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useEffect } from 'react'
import { getUserProfile } from '@/views/account/Settings/store/SettingsSlice'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = [
    {
        label: 'Profile',
        path: '/app/account/settings/profile',
        icon: <HiOutlineUser />,
    },
    {
        label: 'Account Setting',
        path: '/app/account/settings/profile',
        icon: <HiOutlineCog />,
    },
    // {
    //     label: 'Activity Log',
    //     path: '/app/account/activity-log',
    //     icon: <FiActivity />,
    // },
]

const _UserDropdown = ({ className }: CommonProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    // ✅ Get profile data from Redux instead of localStorage
    const { profileData, getProfileLoading } = useSelector(
        (state: RootState) => state.settings,
    )

    // ✅ Fetch profile data on component mount
    useEffect(() => {
        if (!profileData) {
            dispatch(getUserProfile())
        }
    }, [dispatch, profileData])

    // ✅ Fallback to localStorage if API data is not available yet
    const localUser =
        JSON.parse(localStorage.getItem('userdetails') || '{}')?.data || {}

    // ✅ Use API data first, then fallback to localStorage
    const avatar =
        profileData?.data?.profileImage?.url || localUser.profileImage || ''
    const userName = profileData?.data?.name || localUser.name || 'Anonymous'
    const email = profileData?.data?.email || localUser.email || ''
    const authority = [profileData?.data?.role || localUser.role || 'guest']

    const handleSignOut = () => {
        localStorage.clear()
        window.location.reload()

        dispatch(signOutSuccess())
        dispatch(
            setUser({
                avatar: '',
                userName: '',
                email: '',
                authority: [],
            }),
        )
    }

    const UserAvatar = (
        <div className={classNames(className, 'flex items-center gap-2')}>
            <Avatar size={32} shape="circle" src={avatar} />
            <div className="hidden md:block">
                <div className="text-xs capitalize">
                    {authority?.[0] || 'guest'}
                </div>
                <div className="font-bold">{userName}</div>
            </div>
        </div>
    )

    return (
        <div>
            <Dropdown
                menuStyle={{ minWidth: 240 }}
                renderTitle={UserAvatar}
                placement="bottom-end"
            >
                <Dropdown.Item variant="header">
                    <div className="py-2 px-3 flex items-center gap-2">
                        <Avatar shape="circle" src={avatar} />
                        <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">
                                {userName}
                            </div>
                            <div className="text-xs">{email}</div>
                        </div>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />
                {dropdownItemList.map((item) => (
                    <Dropdown.Item
                        key={item.label}
                        eventKey={item.label}
                        className="mb-1 px-0"
                    >
                        <Link
                            className="flex h-full w-full px-2"
                            to={item.path}
                        >
                            <span className="flex gap-2 items-center w-full">
                                <span className="text-xl opacity-50">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </span>
                        </Link>
                    </Dropdown.Item>
                ))}
                <Dropdown.Item variant="divider" />
                <Dropdown.Item
                    eventKey="Sign Out"
                    className="gap-2"
                    onClick={handleSignOut}
                >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                    <span>Sign Out</span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
