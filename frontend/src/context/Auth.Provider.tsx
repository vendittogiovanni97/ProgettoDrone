/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, PropsWithChildren, useState } from "react";
import { AuthContextType } from "../types/Auth.Context.type";
import { LoginForm } from "../types/Login.Form.Type";
import { RegisterForm } from "../types/Register.Form.Type";
import { backendFetch } from "../services/apiAuth";

export const AuthContext = createContext<AuthContextType>({
  login: async (data: LoginForm) => false,
  register: async (data: RegisterForm) => false,
  isLogged: false,
  userLogged: null,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLogged, setIsLogged] = useState(false);
  const [userLogged, setUserLogged] = useState(null);

  const login = async (data: LoginForm) => {
    console.log("data", data);
    const { fetchResult, responseBody, responseDetails } = await backendFetch(
      "/account/login",
      "post",
      data
    );
    console.log("details", responseDetails);

    if (fetchResult.ok) {
      setIsLogged(true);
      setUserLogged(responseBody.data);
      return true;
    } else {
      return false;
    }
  };

  const register = async (data: RegisterForm) => {
    try {
      const { fetchResult, responseBody } = await backendFetch(
        "/account/register",
        "post",
        data
      );
      console.log("Risposta registrazione", fetchResult.status, responseBody);

      if (fetchResult.ok) {
        return true;
      } else {
        console.error("Errore server:", responseBody);
        return false;
      }
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      return false;
    }
  };
  return (
    <AuthContext.Provider value={{ isLogged, userLogged, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};
