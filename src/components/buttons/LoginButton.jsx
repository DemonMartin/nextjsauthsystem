import Link from "next/link";

export default function LoginButton() {
    return (
        <Link href="/login">
            <button className="bg-gray-600 bg-opacity-25 hover:bg-opacity-50 border border-gray-400 text-white font-bold py-2 px-4 rounded transition">
                Login
            </button>
        </Link>
    )
}