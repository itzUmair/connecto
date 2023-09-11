import { useState, useRef } from "react";
import * as Types from "../Types";
import api from "../api/axios";
import { AxiosError } from "axios";

import WrongIcon from "../assets/wrong.svg";
import RightIcon from "../assets/right.svg";

const AuthenticationForm = ({
  authData,
  personalData,
  setAuthData,
  setPage,
}: {
  authData: Types.AuthenticationForm;
  personalData: Types.PersonalDataForm;
  setAuthData: React.Dispatch<React.SetStateAction<Types.AuthenticationForm>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [authenticationData, setAuthenticationData] =
    useState<Types.AuthenticationForm>(authData);

  const passwordRef = useRef<HTMLInputElement>(null);

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordCriteria, setPasswordCriteria] = useState({
    criteria1: false,
    criteria2: false,
    criteria3: false,
    criteria4: false,
    criteria5: false,
  });
  const [showHint, setShowHint] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const updateCriteria = () => {
    if (!passwordRef.current) return;
    if (passwordRef.current.value.length >= 8) {
      setPasswordCriteria((prevCriteria) => ({
        ...prevCriteria,
        criteria1: true,
      }));
    } else {
      setPasswordCriteria((prevCriteria) => ({
        ...prevCriteria,
        criteria1: false,
      }));
    }
    if (/[@$!%*&]/.test(passwordRef.current.value)) {
      setPasswordCriteria((prevCriteria) => ({
        ...prevCriteria,
        criteria2: true,
      }));
    } else {
      setPasswordCriteria((prevCriteria) => ({
        ...prevCriteria,
        criteria2: false,
      }));
    }
    if (/[0-9]/.test(passwordRef.current.value)) {
      setPasswordCriteria((prevCriteria) => ({
        ...prevCriteria,
        criteria3: true,
      }));
    } else {
      setPasswordCriteria((prevCriteria) => ({
        ...prevCriteria,
        criteria3: false,
      }));
    }
    if (/[A-Z]/.test(passwordRef.current.value)) {
      setPasswordCriteria((prevCriteria) => ({
        ...prevCriteria,
        criteria4: true,
      }));
    } else {
      setPasswordCriteria((prevCriteria) => ({
        ...prevCriteria,
        criteria4: false,
      }));
    }
    if (/[a-z]/.test(passwordRef.current.value)) {
      setPasswordCriteria((prevCriteria) => ({
        ...prevCriteria,
        criteria5: true,
      }));
    } else {
      setPasswordCriteria((prevCriteria) => ({
        ...prevCriteria,
        criteria5: false,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailError("");
    setPasswordError("");
    if (e.target.name === "email") {
      setAuthenticationData((prevData) => ({
        ...prevData,
        email: e.target.value,
      }));
    } else if (e.target.name === "password") {
      setAuthenticationData((prevData) => ({
        ...prevData,
        password: e.target.value,
      }));
    } else {
      setConfirmPassword(e.target.value);
    }
    updateCriteria();
  };

  const verifyAuthenticationData = (): boolean => {
    if (authenticationData.email.length === 0) {
      setEmailError("Email is required");
      return false;
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
        authenticationData.email
      )
    ) {
      setEmailError("Invalid email");
      return false;
    } else if (authenticationData.password.length === 0) {
      setPasswordError("Password is required");
      return false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*&])[A-Za-z\d@$!%*&]{8,}$/.test(
        authenticationData.password
      )
    ) {
      setPasswordError("Password criteria is not met");
      return false;
    } else if (authenticationData.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    } else {
      return true;
    }
  };

  const handleFinish = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!verifyAuthenticationData()) return;
    setAuthData(authenticationData);

    try {
      await api.post("/signup", {
        ...personalData,
        ...authenticationData,
      });
      setPage(3);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        const responseData = err.response.data as Types.SignupResponse;
        if (err.response.status === 400) {
          setError(responseData.error);
        }
      }
    }
  };

  const handleGoBack = () => {
    setAuthData(authenticationData);
    console.log(authenticationData);
    setPage(1);
  };

  return (
    <form className="flex flex-col gap-y-2 w-full pb-8 md:w-96 md:mx-auto">
      <h3 className="font-semibold text-content">Your credentials</h3>

      <div>
        <label htmlFor="email" className="text-content block text-sm">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={authenticationData.email}
          className="bg-transparent w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary"
          onChange={handleChange}
        />
        {emailError.length > 0 && (
          <p className="text-red-500 text-sm">{emailError}</p>
        )}
      </div>
      <div className="relative">
        <label htmlFor="password" className="text-content block text-sm">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={authenticationData.password}
          onFocus={() => setShowHint(true)}
          onBlur={() => setShowHint(false)}
          ref={passwordRef}
          className="bg-transparent w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary"
          onChange={handleChange}
        />
        <a
          onClick={() => setShowPassword((prevState) => !prevState)}
          className="text-content absolute right-5 top-7 cursor-pointer"
        >
          {showPassword ? (
            <svg
              className="w-6 h-6 text-content"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="m2 13.587 3.055-3.055A4.913 4.913 0 0 1 5 10a5.006 5.006 0 0 1 5-5c.178.008.356.026.532.054l1.744-1.744A8.973 8.973 0 0 0 10 3C4.612 3 0 8.336 0 10a6.49 6.49 0 0 0 2 3.587Z" />
              <path d="m12.7 8.714 6.007-6.007a1 1 0 1 0-1.414-1.414L11.286 7.3a2.98 2.98 0 0 0-.588-.21l-.035-.01a2.981 2.981 0 0 0-3.584 3.583c0 .012.008.022.01.033.05.204.12.401.211.59l-6.007 6.007a1 1 0 1 0 1.414 1.414L8.714 12.7c.189.091.386.162.59.211.011 0 .021.007.033.01a2.981 2.981 0 0 0 3.584-3.584c0-.012-.008-.023-.011-.035a3.05 3.05 0 0 0-.21-.588Z" />
              <path d="M17.821 6.593 14.964 9.45a4.952 4.952 0 0 1-5.514 5.514L7.665 16.75c.767.165 1.55.25 2.335.251 6.453 0 10-5.258 10-7 0-1.166-1.637-2.874-2.179-3.407Z" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-content"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 14"
            >
              <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
            </svg>
          )}
        </a>
        <div
          className={`bg-accent p-1 mt-1 text-content text-sm ${
            showHint
              ? "scale-y-100 opacity-100"
              : "scale-y-0 absolute opacity-0"
          } transition-all origin-top ease-in`}
        >
          <p>Password must contain:</p>
          <ul className="pl-2">
            <li className="flex mb-1">
              <img
                src={passwordCriteria.criteria1 ? RightIcon : WrongIcon}
                className="w-4 h-4 mr-1"
              />
              Atleast 8 characters
            </li>
            <li className="flex mb-1">
              <img
                src={passwordCriteria.criteria2 ? RightIcon : WrongIcon}
                className="w-4 h-4 mr-1"
              />
              Atleast 1 symbol (i.e. @,$,!,%,*,&)
            </li>
            <li className="flex mb-1">
              <img
                src={passwordCriteria.criteria3 ? RightIcon : WrongIcon}
                className="w-4 h-4 mr-1"
              />
              Atleast 1 number
            </li>
            <li className="flex mb-1">
              <img
                src={passwordCriteria.criteria4 ? RightIcon : WrongIcon}
                className="w-4 h-4 mr-1"
              />
              Atleast 1 Uppercase letter
            </li>
            <li className="flex mb-1">
              <img
                src={passwordCriteria.criteria5 ? RightIcon : WrongIcon}
                className="w-4 h-4 mr-1"
              />
              Atleast 1 Lowercase letter
            </li>
          </ul>
        </div>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="text-content block text-sm">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className="bg-transparent w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary"
          onChange={handleChange}
        />
        {passwordError.length > 0 && (
          <p className="text-red-500 text-sm">{passwordError}</p>
        )}
        {error.length > 0 && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <div className="flex flex-col gap-x-2 items-center justify-end">
        <button
          onClick={handleFinish}
          className="text-white w-full py-2 mt-4 shadow-primary/70 shadow-lg bg-gradient-to-r from-gradient-1 to-gradient-2 disabled:opacity-50"
        >
          Create Account
        </button>
        <button
          onClick={handleGoBack}
          className="py-2 mt-4 bg-gradient-to-r from-gradient-1 to-gradient-2 text-transparent bg-clip-text font-bold"
        >
          Go Back
        </button>
      </div>
    </form>
  );
};

export default AuthenticationForm;
