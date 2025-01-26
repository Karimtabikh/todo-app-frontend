const API_ENDPOINT = "http://localhost:3001/auth/login";

type LoginResponse = {
  access_token: string;
};

type UserData = {
  email: string;
  password: string;
};

export const getUser = async (data: UserData) => {
  const response = await fetch(`${API_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("error");
  }

  const resData: LoginResponse = await response.json();
  localStorage.setItem("token", resData.access_token);

  return resData;
};
