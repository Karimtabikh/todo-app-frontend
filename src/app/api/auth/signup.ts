const API_ENDPOINT = "http://localhost:3001/users";

type UserData = {
  name: string;
  email: string;
  password: string;
};

export const createUser = async (data: UserData) => {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create user");
  }

  return response.json();
};
