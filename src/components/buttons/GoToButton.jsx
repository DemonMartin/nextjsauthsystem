import Link from "next/link";

export default function GoToButton({to, href}) {
  return (
    <Link href={href}>
      <button className="hover:bg-blue-700 bg-blue-500 text-white font-bold py-2 px-4 rounded">
        Go to {to}
      </button>
    </Link>
  );
}
