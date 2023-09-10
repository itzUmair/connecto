import React, { useState } from "react";
import * as Types from "../Types";
import locations from "../constants/location.json";
import interests from "../constants/interest.json";

const PersonalDataForm = ({
  setPersonData,
  setPage,
}: {
  setPersonData: React.Dispatch<React.SetStateAction<Types.PersonalDataForm>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [personalData, setPersonalData] = useState<Types.PersonalDataForm>({
    fname: "",
    mname: "",
    lname: "",
    city: "",
    country: "",
    dob: new Date("1900-01-01"),
    interest: [],
  });

  const [fnameError, setFnameError] = useState<string>("");
  const [lnameError, setLnameError] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [countryError, setCountryError] = useState<string>("");
  const [cityError, setCityError] = useState<string>("");
  const [interestError, setInterestError] = useState<string>("");

  const [allowNext, setAllowNext] = useState<boolean>(true);

  const selectedCities = personalData.country
    ? (locations as Types.LocationData)[personalData.country]
    : [];

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDateError("");
    setFnameError("");
    setLnameError("");
    setCountryError("");
    setCityError("");
    setInterestError("");
    if (e.target.name === "fname") {
      setPersonalData((prevData) => ({ ...prevData, fname: e.target.value }));
    } else if (e.target.name === "mname") {
      setPersonalData((prevData) => ({ ...prevData, mname: e.target.value }));
    } else if (e.target.name === "lname") {
      setPersonalData((prevData) => ({ ...prevData, lname: e.target.value }));
    } else if (e.target.name === "country") {
      setPersonalData((prevData) => ({ ...prevData, country: e.target.value }));
    } else if (e.target.name === "city") {
      setPersonalData((prevData) => ({ ...prevData, city: e.target.value }));
    } else if (e.target.name === "dob") {
      if (new Date(e.target.value) > new Date()) {
        setDateError("Date of birth should not be in the future");
      } else if (new Date(e.target.value).getFullYear() < 1900) {
        setDateError("Date of birth should not be before 01-01-1900 ");
      } else {
        setPersonalData((prevData) => ({
          ...prevData,
          dob: new Date(e.target.value),
        }));
      }
    } else if (e.target.name === "interest") {
      setPersonalData((prevData) => ({
        ...prevData,
        interest: [...personalData.interest, e.target.value],
      }));
    }
  };

  const verifyPersonalData = (): boolean => {
    if (personalData.fname === "") {
      setFnameError("First name is required");
      return false;
    } else if (personalData.lname === "") {
      setLnameError("Last name is required");
      return false;
    } else if (personalData.country === "") {
      setCountryError("Country is required");
      return false;
    } else if (personalData.city === "") {
      setCityError("City is required");
      return false;
    } else if (personalData.dob === new Date("1900-01-01")) {
      setDateError("Date of birth date is required");
      return false;
    } else if (personalData.interest.length === 0) {
      setInterestError("Please select atleast one hobby");
      return false;
    } else {
      return true;
    }
  };

  const handleFinish = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!verifyPersonalData()) return;
    setPersonData(personalData);
    setPage(2);
  };

  const removeSelectedHobby = (
    e: React.MouseEvent<HTMLParagraphElement>
  ): void => {
    console.log("Reading" !== e.currentTarget.getAttribute("data-hobby"));
    const updatedHobbies = personalData.interest.filter(
      (hobby) => hobby !== e.currentTarget.getAttribute("data-hobby")
    );
    setPersonalData((prevData) => ({
      ...prevData,
      interest: updatedHobbies,
    }));
  };

  return (
    <form className="flex flex-col gap-y-2 w-full pb-8">
      <h3 className="font-semibold text-content">Tell us about yourself</h3>
      <div>
        <label htmlFor="fname" className="text-content block text-sm">
          First Name
        </label>
        <input
          type="text"
          id="fname"
          name="fname"
          className="bg-transparent w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary"
          onChange={handleChange}
          maxLength={20}
        />
        {fnameError.length > 0 && (
          <p className="text-red-500 text-sm">{fnameError}</p>
        )}
      </div>
      <div>
        <label htmlFor="mname" className="text-content block text-sm">
          Middle Name
        </label>
        <input
          type="text"
          id="mname"
          name="mname"
          className="bg-transparent w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary"
          onChange={handleChange}
          maxLength={20}
        />
      </div>
      <div>
        <label htmlFor="lname" className="text-content block text-sm">
          Last Name
        </label>
        <input
          type="text"
          id="lname"
          name="lname"
          className="bg-transparent w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary"
          onChange={handleChange}
          maxLength={20}
        />
        {lnameError.length > 0 && (
          <p className="text-red-500 text-sm">{lnameError}</p>
        )}
      </div>
      <div>
        <label htmlFor="dob" className="text-content block text-sm">
          Date of Birth
        </label>
        <input
          type="date"
          id="dob"
          name="dob"
          className="bg-transparent w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary"
          onChange={handleChange}
          min="1900-01-01"
          defaultValue="2000-01-01"
          max={new Date().toISOString().split("T")[0]}
        />
        {dateError.length > 0 && (
          <p className="text-red-500 text-sm">{dateError}</p>
        )}
      </div>
      <div>
        <label className="text-content block text-sm">Country</label>
        <select
          name="country"
          value={personalData.country}
          className="bg-secondary w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary"
          onChange={handleChange}
        >
          <option value="">Select a country</option>
          {Object.keys(locations).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {countryError.length > 0 && (
          <p className="text-red-500 text-sm">{countryError}</p>
        )}
      </div>
      <div>
        <label className="text-content block text-sm">City</label>
        <select
          name="city"
          value={personalData.city}
          title={
            personalData.country.length === 0
              ? "please select a country first"
              : ""
          }
          className="bg-secondary w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary disabled:cursor-not-allowed"
          onChange={(e) =>
            setPersonalData({ ...personalData, city: e.target.value })
          }
          disabled={personalData.country.length === 0}
        >
          <option value="">Select a city</option>
          {selectedCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {cityError.length > 0 && (
          <p className="text-red-500 text-sm">{cityError}</p>
        )}
      </div>
      <div>
        <label className="text-content block text-sm">Hobby</label>
        <select
          name="interest"
          value={personalData.interest}
          className="bg-secondary w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary disabled:cursor-not-allowed"
          onChange={handleChange}
          disabled={personalData.interest.length === 10}
        >
          <option value="">Select a hobby</option>
          {interests.map((interest) => {
            if (!personalData.interest.includes(interest)) {
              return (
                <option key={interest} value={interest}>
                  {interest}
                </option>
              );
            }
          })}
        </select>
        <div className="flex flex-wrap gap-1 w-full mt-1">
          {personalData.interest.map((interest) => (
            <p
              key={interest}
              onClick={removeSelectedHobby}
              data-hobby={interest}
              className="bg-gradient-to-br from-gradient-1 to-gradient-2 w-fit px-2 py-1 rounded-lg text-sm text-white"
            >
              {interest}
            </p>
          ))}
        </div>
        {personalData.interest.length > 0 && (
          <p className="text-xs font-bold text-primary mt-1">
            Click on the hobby to remove
          </p>
        )}
        {interestError.length > 0 && (
          <p className="text-red-500 text-sm">{interestError}</p>
        )}
      </div>
      <button
        onClick={handleFinish}
        className="text-white py-2 mt-4 shadow-primary/70 shadow-lg bg-gradient-to-r from-gradient-1 to-gradient-2 disabled:opacity-50"
        disabled={!allowNext}
      >
        Next
      </button>
    </form>
  );
};

export default PersonalDataForm;
