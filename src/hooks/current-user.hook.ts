"use client";
export const useCurrentUser = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
    const ownerInfo = JSON.parse(localStorage.getItem("ownerInfo") as string);
    return [userInfo, userInfo.id, ownerInfo];
  } catch {
    return [null, null];
  }
};
