import { LoginForm } from "./Login.Form.Type"
import { RegisterForm } from "./Register.Form.Type"
import { User } from "./UserLogged.type"

export type AuthContextType = {
  login: (data:LoginForm) => Promise<boolean>
  register: (data : RegisterForm)=> Promise<boolean>
  isLogged: boolean,
  userLogged: User|null
}



