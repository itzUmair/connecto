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

export type SigninFormData = {
  email: string;
  password: string;
};

export type SigninResponse = {
  error: string | undefined;
  token: string | undefined;
  userid: string | undefined;
};

export type CookieStructure = {
  _auth: string;
  _auth_state: string;
  _auth_storage: Date;
  _auth_type: "Bearer";
};

export type UserStructure = {
  _id: string;
  fname: string;
  mname: string;
  lname: string;
  location: {
    city: string;
    country: string;
  };
  profilePicURL: string;
  profileBannerURL: string;
  friends: string[];
  dob: Date;
  doj: Date;
  interests: string[];
  friendRequestsReceived: string[];
  friendRequestsSent: string[];
};

export type ProfileSettingStructure = {
  _id: string;
  fname: string;
  mname: string;
  lname: string;
  location: {
    city: string;
    country: string;
  };
  profilePicURL: string;
  profileBannerURL: string;
  friends: UserStructure[];
  dob: Date;
  doj: Date;
  interests: string[];
  friendRequestsReceived: string[];
  friendRequestsSent: string[];
};

export type UserDetailStructure = {
  details: {
    _id: string;
    fname: string;
    mname: string;
    lname: string;
    location: {
      city: string;
      country: string;
    };
    profilePicURL: string;
    profileBannerURL: string;
    friends: UserStructure[];
    dob: Date;
    doj: Date;
    interests: string[];
    friendRequestsReceived: string[];
    friendRequestsSent: string[];
  };
  posts: PostStructure[];
};

export type CommentStructure = {
  comment: string;
  timestamp: Date;
  userid: {
    _id: string;
    fname: string;
    lname: string;
    profilePicURL: string;
  };
};

export type PostStructure = {
  _id: string;
  text: string;
  image: string;
  video: string;
  userid: {
    _id: string;
    fname: string;
    lname: string;
    profilePicURL: string;
  };
  timestamp: Date;
  likes: string[];
  comments: CommentStructure[];
  category: string;
};

export type UserHighlightStructure = {
  details: UserStructure;
  posts: PostStructure[];
};
