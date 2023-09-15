import { useEffect, useState, useRef } from "react";
import * as Types from "../Types";
import useUserid from "../hooks/useUserid";
import axios from "../api/axios";
import toast from "react-hot-toast";
import locations from "../constants/location.json";
import interests from "../constants/interest.json";
import Header from "./Header";
import ProfilePicPlaceholder from "../assets/profile_placeholder.jpg";
import profileBannerPlaceholder from "../assets/placeholder_banner.webp";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase/firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import LoaderSVG from "../assets/loader.svg";

const ProfileEdit = () => {
  const [userDetails, setUserDetails] = useState<Types.ProfileSettingStructure>(
    {
      _id: "",
      fname: "",
      mname: "",
      lname: "",
      location: {
        city: "",
        country: "",
      },
      profilePicURL: "",
      profileBannerURL: "",
      friends: [],
      dob: new Date(),
      doj: new Date(),
      interests: [],
      friendRequestsReceived: [],
      friendRequestsSent: [],
    }
  );
  const [ppicError, setPpicError] = useState<string>("");
  const [pbannerError, setPbannerError] = useState<string>("");
  const [fnameError, setFnameError] = useState<string>("");
  const [lnameError, setLnameError] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [countryError, setCountryError] = useState<string>("");
  const [cityError, setCityError] = useState<string>("");
  const [interestError, setInterestError] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState("default");
  const [selectedCity, setSelectedCity] = useState("default");
  const [selectedInterest, setSelectedInterest] = useState("default");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profilepic, setProfilepic] = useState<string>();
  const [profilebanner, setProfilebanner] = useState<string>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const navigate = useNavigate();
  const uid = useUserid();

  const profilePicRef = useRef<HTMLInputElement>(null);
  const profileBannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);
    const getUserDetails = async () => {
      try {
        const response = await axios.get(`/user/details/${uid}`);
        setUserDetails(response.data.details);
        setSelectedCountry(response.data.details.location.country);
        setSelectedCity(response.data.details.location.city);
        setSelectedInterest(response.data.details.interests);
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    getUserDetails();
  }, [uid, refresh]);

  const selectedCities = userDetails?.location.country
    ? (locations as Types.LocationData)[userDetails.location.country]
    : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDateError("");
    setFnameError("");
    setLnameError("");
    setCountryError("");
    setCityError("");
    setInterestError("");
    setPpicError("");
    setPbannerError("");
    if (!userDetails) return;
    if (e.target.name === "fname") {
      setUserDetails((prevData) => ({ ...prevData, fname: e.target.value }));
    } else if (e.target.name === "mname") {
      setUserDetails((prevData) => ({ ...prevData, mname: e.target.value }));
    } else if (e.target.name === "lname") {
      setUserDetails((prevData) => ({ ...prevData, lname: e.target.value }));
    } else if (e.target.name === "country") {
      setSelectedCountry(e.target.value);
      setUserDetails((prevData) => ({ ...prevData, country: e.target.value }));
    } else if (e.target.name === "city") {
      setSelectedCity(e.target.value);
      setUserDetails((prevData) => ({ ...prevData, city: e.target.value }));
    } else if (e.target.name === "profilepic") {
      const droppedFiles: FileList | null | undefined =
        profilePicRef?.current?.files;
      if (!droppedFiles) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setProfilepic(e.target.result as string);
        }
      };
      reader.readAsDataURL(droppedFiles[0]);
      if (
        !droppedFiles[0]?.name.endsWith(".jpg") &&
        !droppedFiles[0]?.name.endsWith(".jpeg") &&
        !droppedFiles[0]?.name.endsWith(".webp")
      ) {
        setPpicError("Please provide image in .jpg, .jpeg or .webp format");
        return;
      }
    } else if (e.target.name === "profilebanner") {
      const droppedFiles: FileList | null | undefined =
        profileBannerRef?.current?.files;
      if (!droppedFiles) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setProfilebanner(e.target.result as string);
        }
      };
      reader.readAsDataURL(droppedFiles[0]);
      if (
        !droppedFiles[0]?.name.endsWith(".jpg") &&
        !droppedFiles[0]?.name.endsWith(".jpeg") &&
        !droppedFiles[0]?.name.endsWith(".webp")
      ) {
        setPpicError("Please provide image in .jpg, .jpeg or .webp format");
        return;
      }
    } else if (e.target.name === "dob") {
      try {
        new Date(e.target.value).toISOString().split("T")[0];
        setUserDetails((prevData) => ({
          ...prevData,
          dob: new Date(e.target.value),
        }));
      } catch (error) {
        setUserDetails((prevData) => ({
          ...prevData,
          dob: new Date("2000-01-01"),
        }));
      }
    } else if (e.target.name === "interest") {
      setSelectedInterest(e.target.value);
      setUserDetails((prevData) => ({
        ...prevData,
        interests: [...userDetails.interests, e.target.value],
      }));
    }
  };

  const verifyPersonalData = (): boolean => {
    if (userDetails.fname === "") {
      setFnameError("First name is required");
      return false;
    } else if (userDetails.lname === "") {
      setLnameError("Last name is required");
      return false;
    } else if (userDetails.location.country === "") {
      setCountryError("Country is required");
      return false;
    } else if (userDetails.location.city === "") {
      setCityError("City is required");
      return false;
    } else if (userDetails.interests.length === 0) {
      setInterestError("Please select atleast one hobby");
      return false;
    } else {
      return true;
    }
  };

  const handleFinish = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!verifyPersonalData()) return;
    setIsUpdating(true);
    let ppDownloadURL;
    let pbDownloadURL;
    try {
      if (
        profilePicRef.current &&
        profilePicRef.current.files &&
        profilePicRef.current.files.length > 0
      ) {
        const storageRefPP = ref(storage, `/${userDetails._id}/profile_pic`);
        const uploadPromisePP = await uploadBytes(
          storageRefPP,
          profilePicRef?.current?.files[0]
        );
        ppDownloadURL = await getDownloadURL(uploadPromisePP.ref);
      }
      if (
        profileBannerRef.current &&
        profileBannerRef.current.files &&
        profileBannerRef.current.files.length > 0
      ) {
        const storageRefPB = ref(storage, `/${userDetails._id}/profile_banner`);
        const uploadPromisePB = await uploadBytes(
          storageRefPB,
          profileBannerRef?.current?.files[0]
        );
        pbDownloadURL = await getDownloadURL(uploadPromisePB.ref);
      }
      const response = await axios.post("/user/profile/update", {
        ...userDetails,
        profilePicURL: ppDownloadURL,
        profileBannerURL: pbDownloadURL,
        userid: uid,
      });
      toast.success(response.data.message);
      setProfilepic(undefined);
      setProfilebanner(undefined);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const removeSelectedHobby = (
    e: React.MouseEvent<HTMLParagraphElement>
  ): void => {
    const updatedHobbies = userDetails.interests.filter(
      (hobby) => hobby !== e.currentTarget.getAttribute("data-hobby")
    );
    setUserDetails((prevData) => ({
      ...prevData,
      interests: updatedHobbies,
    }));
  };

  return (
    <div>
      <Header profilePicURL={userDetails.profilePicURL} />
      <div className="px-4 md:px-16">
        <h1 className="text-content border-b-2 border-accent pb-4 my-4 font-bold text-2xl">
          Account Settings
        </h1>
        <h3 className="font-semibold text-content mb-4">Personal Details</h3>
        {!isLoading && userDetails && (
          <form className="flex flex-col gap-y-2 w-full pb-8 md:w-96">
            <div>
              {userDetails.profilePicURL !== "" ? (
                <img src={userDetails.profilePicURL} className="w-24 my-2" />
              ) : (
                <img src={ProfilePicPlaceholder} className="w-24 my-2" />
              )}
              {profilepic && (
                <>
                  <p className="text-content/50 text-sm">Change to:</p>
                  <img src={profilepic} className="w-24 my-2 aspect-square" />
                </>
              )}
              <label htmlFor="fname" className="text-content block text-sm">
                Profile Picture
              </label>
              <input
                type="file"
                className="bg-transparent w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary"
                name="profilepic"
                id="profilepic"
                ref={profilePicRef}
                onChange={handleChange}
                accept=".jpg, .webpg, .jpeg"
              />
              {ppicError.length > 0 && (
                <p className="text-red-500 text-sm">{ppicError}</p>
              )}
            </div>
            <div>
              {userDetails.profileBannerURL !== "" ? (
                <img
                  src={userDetails.profileBannerURL}
                  className="w-64 h-24 object-cover my-2"
                />
              ) : (
                <img
                  src={profileBannerPlaceholder}
                  className="w-64 h-24 object-cover my-2"
                />
              )}
              {profilebanner && (
                <>
                  <p className="text-content/50 text-sm">Change to:</p>
                  <img
                    src={profilebanner}
                    className="w-64 h-24 object-cover my-2"
                  />
                </>
              )}
              <label htmlFor="fname" className="text-content block text-sm">
                Profile Banner
              </label>
              <input
                type="file"
                className="bg-transparent w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary"
                name="profilebanner"
                id="profilebanner"
                ref={profileBannerRef}
                onChange={handleChange}
                accept=".jpg, .webpg, .jpeg"
              />
              {pbannerError.length > 0 && (
                <p className="text-red-500 text-sm">{pbannerError}</p>
              )}
            </div>
            <div>
              <label htmlFor="fname" className="text-content block text-sm">
                First Name
              </label>
              <input
                type="text"
                id="fname"
                name="fname"
                value={userDetails.fname}
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
                value={userDetails.mname}
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
                value={userDetails.lname}
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
                value={new Date(userDetails.dob).toISOString().split("T")[0]}
                className="bg-transparent w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary"
                onChange={handleChange}
                min="1900-01-01"
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
                value={selectedCountry}
                className="bg-secondary w-full capitalize border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary"
                onChange={handleChange}
              >
                <option value="default">Select a country</option>
                {Object.keys(locations).map((country, index) => (
                  <option key={index} value={country}>
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
                value={selectedCity}
                title={
                  userDetails.location.country.length === 0
                    ? "please select a country first"
                    : ""
                }
                className="bg-secondary w-full border capitalize border-content p-1 text-content mt-1 focus:outline-none focus:border-primary disabled:cursor-not-allowed"
                onChange={handleChange}
                disabled={userDetails.location.country.length === 0}
              >
                <option value="default">Select a city</option>
                {selectedCities &&
                  selectedCities.map((city, index) => (
                    <option key={index} value={city}>
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
                value={selectedInterest}
                className="bg-secondary w-full border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary disabled:cursor-not-allowed"
                onChange={handleChange}
                disabled={userDetails.interests.length === 10}
              >
                <option value="default">Select a hobby</option>
                {interests.map((interest, index) => {
                  if (!userDetails.interests.includes(interest)) {
                    return (
                      <option key={index} value={interest}>
                        {interest}
                      </option>
                    );
                  }
                })}
              </select>
              <div className="flex flex-wrap gap-1 w-full mt-2">
                {userDetails.interests.map((interest) => (
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
              {userDetails.interests.length > 0 && (
                <p className="text-xs font-bold text-primary mt-1">
                  Click on the hobby to remove
                </p>
              )}
              {interestError.length > 0 && (
                <p className="text-red-500 text-sm">{interestError}</p>
              )}
            </div>
            <div></div>
            <button
              onClick={handleFinish}
              className="text-white py-2 mt-4 shadow-primary/70 shadow-lg bg-gradient-to-r from-gradient-1 to-gradient-2 disabled:opacity-50"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <img
                  src={LoaderSVG}
                  alt="loading..."
                  className="animate-spin opacity-100 w-6 h-6 mx-auto"
                />
              ) : (
                "Save"
              )}
            </button>
            <button
              onClick={() => navigate("/feed")}
              className="py-2 mt-4 bg-gradient-to-r from-gradient-1 to-gradient-2 text-transparent bg-clip-text font-bold disabled:cursor-not-allowed"
              disabled={isUpdating}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileEdit;
