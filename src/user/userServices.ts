import axios, { AxiosError } from "axios";
import { environment } from "../app/environment/environment.ts"
import { cleanupSessionToken, updateSessionToken } from "../store/tokenStore.ts"
import { cleanupSessionUser, updateSessionUser } from "../store/userStore.ts"

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
axios.defaults.headers.common["Content-Type"] = "application/json"

export interface Token {
  token: string
}

export interface User {
  id: string
  name: string
  username: string
  email: string
  password: string
}

// Valores almacenados en LOCAL STORE
function getCurrentToken(): string | undefined {
  const result = localStorage.getItem("token");
  return result ? result : undefined;
}

function setCurrentToken(token: string) {
  localStorage.setItem("token", token)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  axios.defaults.headers.common.Authorization = `bearer ${token}`;
}

function getCurrentUser(): User | undefined {
  return localStorage.getItem("user") as unknown as User
}

export async function logout(): Promise<void> {
  localStorage.removeItem("token")
  localStorage.removeItem("user")

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  axios.defaults.headers.common.Authorization = ""

  cleanupSessionToken()
  cleanupSessionUser()
}

// actualizar el usuario almacenado en local storage dado el email ingresado en el login
export async function reloadCurrentUser(email: string): Promise<User> {
  try {
    const res = (await axios.get(`${environment.backendUrl}/users`, {})).data.users;

    const currentUser = (res.filter(user => user.email === email)) as User;

    localStorage.setItem("user", JSON.stringify(currentUser));
    updateSessionUser(currentUser);

    return currentUser;

  } catch (err) {
    const axiosError = err as AxiosError

    if (axiosError.response && axiosError.response.status === 401) {
      void logout();
    }
    
    throw err
  }
}

export async function createUser(name: string, username: string, email: string, password: string) {
    await axios.post(`${environment.backendUrl}/users`, {
      name: name,
      username: username,
      email: email,
      password: password
    })
    .then(function (response) {
      console.log(response);
      alert("Usuario creado correctamente.");
    })
    .catch(function (error) {
      console.log(error);
    });
}

export async function login(email: string, password: string): Promise<Token> {
  const res = (
    await axios.post(`${environment.backendUrl}/auth/login`, {
    email: email,
    password: password
  })
  ).data as Token

  setCurrentToken(res.token);
  updateSessionToken(res.token);
  alert("Sesión iniciada, ahora podés jugar.");
  void reloadCurrentUser(email).then()
  return res;
}

if (getCurrentToken()) {
  const currentUser = getCurrentUser();
  const currentToken = getCurrentToken();
  if (currentUser !== undefined && currentToken !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    axios.defaults.headers.common.Authorization = `bearer ${currentToken}`;
    updateSessionToken(currentToken);
    updateSessionUser(currentUser);
  }
}