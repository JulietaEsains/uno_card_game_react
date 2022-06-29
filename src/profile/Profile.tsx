import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCurrentProfile, updateBasicInfo } from "./profileServices.ts"
import Button from "../common_components/Button.tsx"
import Input from "../common_components/Input.tsx"

export default function Profile() {
    const history = useNavigate()
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
  
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserId = currentUser[0].id
  
    const loadProfile = async () => {
      if (currentUserId) {
        try {
          const result = await getCurrentProfile(currentUserId)
    
          setName(result.name)
          setUsername(result.username)
          setEmail(result.email)
        } catch (error) {
          console.log(error)
        }
      }
    }
  
    const updateClick = async (e) => {
      e.preventDefault()

      if (!name || !username || !email) {
        alert("Los campos no pueden estar vacíos.")
        return
      }
  
      try {
        await updateBasicInfo(name, username, email, currentUserId).then(function (response) {
          console.log(response)
          alert("Datos actualizados correctamente.")
          history("/")
        })
      } catch (error) {
        console.log(error)
      }
    }
  
    useEffect(() => {
      void loadProfile()
    }, [])
  
    return (
      <div className = "user-form">
        <form autoComplete = "off">  
          <label>
                Nombre: <Input 
                        name = "name"
                        type = "text"
                        value = {name}
                        onChange = {(event) => setName(event.target.value)}
                        />
          </label>
          <br />
          <label>
                Nombre de usuario: <Input 
                        name = "username"
                        type = "text"
                        value = {username}
                        onChange = {(event) => setUsername(event.target.value)}
                        />
          </label>
          <br />
          <label>
                Email: <Input 
                        name = "email"
                        type = "email"
                        value = {email}
                        onChange = {(event) => setEmail(event.target.value)}
                        />
          </label>
          <br />

          <div className="btns-container btn-confirm">
                <Button 
                    value = "Actualizar datos"
                    onClick = {updateClick}
                />
          </div>
        </form>
      </div>
    )
}