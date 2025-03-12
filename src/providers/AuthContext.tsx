"use client";
import { getUserInfo, login } from "@/hooks/use-auth";
import { Account, User } from "@/models/user.model";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// const userDefault: User = {
//   id: "",
//   email: "",
//   name: "",
//   enabled: false,
//   phoneNumber: "",
//   accountId: "",
//   gender: "",
//   type: "",
//   profileImage: {
//     filename: "",
//     mimetype: "",
//     originalname: "",
//     size: 0,
//     path: "",
//   },
//   address: {
//     country: "",
//     city: "",
//     subCity: "",
//     woreda: "",
//     houseNumber: "",
//   },
//   emergencyContact: {
//     name: "",
//     phoneNumber: "",
//   },
//   role: [""],
//   permission: [""],
// };

type AuthContextType = {
  user: User | null;
  authenticated: boolean;
  login: (account: Account) => void;
  logOut: () => void;
};
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  // const [context, setContext] = useState({
  //   user: userDefault,
  //   authenticated: false,
  //   login: Login,
  //   logOut: Logout,
  // });
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function init() {
      const user = localStorage.getItem("user");
      if (user) {
        await setUser(JSON.parse(user as string));
        await setAuthenticated(true);
      }
    }

    init();
  }, []);

  async function Login(account: Account) {
    const loginResponse = await login(account);
    if (loginResponse) {
      const data = await getUserInfo();
      if (data?.id) {
        await setUser(data);
        await setAuthenticated(true);

        if (authenticated) {
          router.push("/dashboard");
        }
      }
    }

    // if(data?.)
  }

  async function Logout() {
    await localStorage.removeItem("accessToken");
    await localStorage.removeItem("user");
    await localStorage.removeItem("refreshToken");
    // setUser(null);
    // setAuthenticated(false);
    router.push("/signin");
  }

  return (
    <AuthContext.Provider
      value={{
        login: Login,
        logOut: Logout,
        authenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
