import Link from "next/link";

export default function LogoutButton() {
  // post request to /api/auth/logout
    const logout = async () => {
        await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        });
    };

    return (
        <Link href="/">
            <button
                onClick={logout}
                className="hover:bg-blue-700 bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors duration-500"
            >
                Logout
            </button>
        </Link>
    );
  
}
