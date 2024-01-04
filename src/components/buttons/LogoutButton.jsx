import Link from "next/link";

export default function LogoutButton() {
  // opens the logout api
  return (
    <Link href={"/logout"}>
      <button className="hover:bg-blue-700 bg-blue-500 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
    </Link>
  );
}
