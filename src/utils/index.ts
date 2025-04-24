
export const storeToken = (token: string): void => {
    localStorage.setItem("access_token", token); 
  };
  
 export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    console.log("Token Retrieved from Storage:", token);
    return token;
  }
  console.warn("Window is not defined. Running on the server?");
  return null;
  };