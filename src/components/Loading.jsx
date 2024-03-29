export default function Loading() {
  return (
    <div className="flex items-center justify-center animate__animated animate__bounceIn">
      <div className="w-24 h-24 bg-white shadow-lg rounded-lg p-4">
        <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}