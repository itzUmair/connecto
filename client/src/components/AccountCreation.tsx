import ConfettiExplosion from "react-confetti-explosion";
import RightIcon from "../assets/right.svg";

const AccountCreation = () => {
  return (
    <div className="flex flex-col items-center text-center gap-y-2 text-content md:w-96 md:mx-auto">
      <img src={RightIcon} />
      <h3 className="text-2xl font-bold">Hurray!</h3>
      <p>
        Your account is created successfully! Sign in now to start making new
        friends.
      </p>
      <a
        href="/signin"
        className="text-white text-center w-full py-2 mt-4 shadow-primary/70 shadow-lg bg-gradient-to-r from-gradient-1 to-gradient-2 disabled:opacity-50"
      >
        Sign in
      </a>
      {true && (
        <ConfettiExplosion
          duration={5000}
          particleCount={200}
          force={1}
          width={2000}
          particleSize={8}
        />
      )}
    </div>
  );
};

export default AccountCreation;
