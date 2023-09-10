import { useState, useEffect } from "react";
import AuthenticationForm from "./AuthenticationForm";
import PersonalDataForm from "./PersonalDataForm";
import * as Types from "../Types";

const Signup = () => {
  const [signupFormData, setSignupFormData] = useState<Types.SignupFormData>({
    fname: "",
    mname: "",
    lname: "",
    city: "",
    country: "",
    dob: new Date(),
    interest: [],
    email: "",
    password: "",
  });

  const [authData, setAuthData] = useState<Types.AuthenticationForm>({
    email: "",
    password: "",
  });

  const [personData, setPersonData] = useState<Types.PersonalDataForm>({
    fname: "",
    mname: "",
    lname: "",
    city: "",
    country: "",
    dob: new Date(),
    interest: [],
  });

  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (page != 3) return;
    const handleSubmit = async () => {
      setSignupFormData({ ...personData, ...authData });
      console.log(signupFormData);
    };
    handleSubmit();
  }, [authData, page, personData, signupFormData]);

  return (
    <div className="px-4 pt-8">
      <h1 className="font-bold w-fit mx-auto text-transparent text-3xl text-center bg-gradient-to-r from-gradient-1 to-gradient-2 bg-clip-text">
        Create Account
      </h1>
      <div className="my-4">
        <div className="flex">
          <span className="flex flex-col w-full items-center justify-center">
            <p className="text-xs border-2 border-content rounded-full w-[1.1rem] h-[1.1rem] text-content text-center font-bold">
              1
            </p>
            <p className="text-xs text-content">About you</p>
          </span>
          <span className="flex flex-col w-full items-center justify-center">
            <p className="text-xs border-2 border-content rounded-full w-[1.1rem] h-[1.1rem] text-content text-center font-bold">
              2
            </p>
            <p className="text-xs text-content">Authentication</p>
          </span>
        </div>
        <div
          className={`h-1 ${
            page === 1 ? "w-3/12" : "w-9/12"
          } bg-gradient-to-r from-gradient-1 to-gradient-2 origin-left rounded-full transition-all`}
        ></div>
      </div>
      {page === 1 && (
        <PersonalDataForm setPersonData={setPersonData} setPage={setPage} />
      )}
      {page === 2 && <AuthenticationForm setAuthData={setAuthData} />}
    </div>
  );
};

export default Signup;
