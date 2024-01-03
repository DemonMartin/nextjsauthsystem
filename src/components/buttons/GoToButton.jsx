import Link from "next/link";

export default function GoToButton({to, href}) {
  return (
    <Link href={href}>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go to {to}
      </button>
    </Link>
  );
}
