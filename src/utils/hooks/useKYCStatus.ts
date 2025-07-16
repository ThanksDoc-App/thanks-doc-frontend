// utils/hooks/useKYCStatus.ts
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export const useKYCStatus = () => {
    const { profileData } = useSelector((state: RootState) => state.settings)

    const shouldHideKYCSetup = () => {
        if (!profileData?.data) return false

        const {
            isAddressSetup,
            isDocumentSetup,
            isProfileSetup,
            isBankSetup,
            role
        } = profileData.data

        // For doctors: Hide KYC setup only if ALL required fields are true
        if (role === 'doctor') {
            return isAddressSetup === true && 
                   isDocumentSetup === true && 
                   isProfileSetup === true && 
                   isBankSetup === true
        }

        // For other roles: Hide KYC setup when address and profile are setup
        return isAddressSetup === true && isProfileSetup === true
    }

    const shouldHideKYCSetupForSales = () => {
        if (!profileData?.data) return false

        const {
            isAddressSetup,
            isProfileSetup,
            role
        } = profileData.data

        // For business role: Hide KYC setup when address and profile are setup
        if (role === 'business') {
            return isAddressSetup === true && isProfileSetup === true
        }

        // For other roles, don't hide
        return false
    }

    return {
        shouldHideKYCSetup: shouldHideKYCSetup(),
        shouldHideKYCSetupForSales: shouldHideKYCSetupForSales(),
        profileData: profileData?.data,
        userRole: profileData?.data?.role
    }
}
