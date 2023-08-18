import { createContext, useState } from 'react'
import { getAccessTokenFromLS, getProfileUserFromLS } from '../pages/Utils/auth'

const initialValues = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  SetIsAuthenticated: () => null,
  profile: getProfileUserFromLS(),
  setProfile: () => null
}

export const AppContext = createContext(initialValues)

export const AppProvider = ({ children }) => {
  const [isAuthenticated, SetIsAuthenticated] = useState(initialValues.isAuthenticated)
  const [profile, setProfile] = useState(initialValues.profile)
  const profileData = { isAuthenticated, SetIsAuthenticated, profile, setProfile }
  return <AppContext.Provider value={profileData}>{children}</AppContext.Provider>
}
