const API_ENDPOINT = "http://localhost:3001/users";

type UserData = {
  email: string;
  password: string;
};

export const getUser = async (data: UserData) => {
  const response = await fetch(`${API_ENDPOINT}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};
