export type PersonalDataForm = {
  fname: string;
  mname: string;
  lname: string;
  city: string;
  country: string;
  dob: Date;
  interest: string[];
};

export type AuthenticationForm = {
  email: string;
  password: string;
};

export type LocationData = {
  [country: string]: string[];
};

export type SignupFormData = {
  fname: string;
  mname: string;
  lname: string;
  city: string;
  country: string;
  dob: Date;
  interest: string[];
  email: string;
  password: string;
};

export type SignupResponse = {
  error: string;
};
