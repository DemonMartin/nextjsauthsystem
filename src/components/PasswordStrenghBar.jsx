import zxcvbn from "zxcvbn";
import validator from "validator";

export default function PasswordStrenghBar({ pw }) {
    let passwordStrength = zxcvbn(pw).score;

    // Check if password fits custom requirements
    if (!validator.isStrongPassword(pw)) {
        passwordStrength = 0; // Set strength to 0 if password does not fit custom requirements
    }

    return (
        <div className="h-2 w-full mt-2 rounded bg-gray-200">
            <div
                className={`h-full ${
                    passwordStrength === 0
                        ? "bg-red-500"
                        : passwordStrength === 1
                        ? "bg-orange-500"
                        : passwordStrength === 2
                        ? "bg-yellow-500"
                        : passwordStrength === 3
                        ? "bg-green-500"
                        : "bg-blue-500"
                } transition-all duration-500 ease-in-out`}
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
            ></div>
        </div>
    );
}