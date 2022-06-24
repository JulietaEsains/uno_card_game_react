import axios, { AxiosError } from "axios"
import { environment } from "../app/environment/environment.ts"
import { logout } from "../user/userServices.ts"

interface Profile {
    name: string
    username: string
    email: string
    //picture: string
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
      ).data as Profile
      return res
    } catch (err) {
      if ((err as AxiosError).code === "401") {
        void logout()
      }
      throw err
    }
}
  
/*interface UpdateProfileImageId {
    id: string
}
  
export async function updateProfilePicture(image: string, userId: string): Promise<UpdateProfileImageId> {
    return (
      await axios.patch(`${environment.backendUrl}/users/${userId}`, {
        picture_url: image
      })
    ).data as UpdateProfileImageId
}*/
  
export async function getCurrentProfile(userId: string): Promise<Profile> {
    try {
      return (await axios.get(`${environment.backendUrl}/users/${userId}`)).data as Profile
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status === 401) {
        void logout()
      }
      throw err
    }
}
  
/*export function getPictureUrl(id: string) {
    if (id && id.length > 0) {
      return environment.backendUrl + "/photo/" + id
    } else {
      return "/assets/profile.png"
    }
}*/