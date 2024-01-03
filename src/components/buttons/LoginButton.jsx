import Link from "next/link";

export default function LoginButton() {
  return (
    <Link href="/login">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Login
      </button>
    </Link>
  );
}
