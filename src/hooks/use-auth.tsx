import { Account } from "@/models/user.model";

export const login = async ({ phoneNumber, password }: Account) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        password: password,
        type: "tenant",
      }),
    });
    const fRes = await res.json();
    if (res.status == 201) {
      await localStorage.setItem("accessToken", fRes?.accessToken);
      await localStorage.setItem("user", JSON.stringify(fRes?.profile));
      await localStorage.setItem("refreshToken", fRes?.refreshToken);
      if (fRes?.profile) {
        return true;
      }
    }

    if (res.status == 400) {
      return false;
    }
  } catch (_) {
    return false;
  }
};
export const getUserInfo = async () => {
  try {
    const token = await localStorage.getItem("accessToken");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/get-user-info`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await res.json();
  } catch (e: any) {
    return e;
  }
};

export const logout = async () => {
  try {
    await localStorage.removeItem("accessToken");
    await localStorage.removeItem("user");
    await localStorage.removeItem("refreshToken");
    return true;
  } catch (_) {
    return false;
  }
};
