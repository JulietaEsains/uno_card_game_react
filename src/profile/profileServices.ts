import axios, { AxiosError } from "axios"
import { environment } from "../app/environment/environment.ts"
import { logout } from "../user/userServices.ts"

interface Profile {
    name: string
    username: string
    email: string
}
  
export async function updateBasicInfo
  (name: string, username: string, email: string, userId: string): Promise<Profile> {
    try {
      const res = (
        await axios.patch(`${environment.backendUrl}/users/${userId}`, {
            name: name,
            username: username,
            email: email
        })
      ).data.user as Profile
      return res
    } catch (err) {
      if ((err as AxiosError).code === "401") {
        void logout()
      }
      throw err
    }
}
  
export async function getCurrentProfile(userId: string): Promise<Profile> {
    try {
      return (await axios.get(`${environment.backendUrl}/users/${userId}`)).data.user as Profile
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status === 401) {
        void logout()
      }
      throw err
    }
}