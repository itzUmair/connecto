import { useState } from "react";
import * as Types from "../Types";

const AuthenticationForm = ({
  setAuthData,
}: {
  setAuthData: React.Dispatch<React.SetStateAction<Types.AuthenticationForm>>;
}) => {
  const [authenticationData, setAuthenticationData] =
    useState<Types.AuthenticationForm>({
      email: "",
      password: "",
    });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "fname") {
      setAuthenticationData((prevData) => ({
        ...prevData,
        email: e.target.value,
      }));
    } else {
      setAuthenticationData((prevData) => ({
        ...prevData,
        password: e.target.value,
      }));
    }
  };

  const handleFinish = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAuthData(authenticationData);
  };

  return (
    <form>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          onChange={handleChange}
        />
      </div>
      <button onClick={handleFinish}>Create Account</button>
    </form>
  );
};

export default AuthenticationForm;
