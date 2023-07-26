"use client";

import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    if (!tokenString) return null;
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: any) => {
    if (!userToken) return setToken(null);
    localStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken.token);
  };

  console.log(token);

  return [token, saveToken];
}
