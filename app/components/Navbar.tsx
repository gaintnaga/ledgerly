export default function Navbar() {
  return (
    <header className="flex h-16 item-center justify-between border-b bg-white px-6">
      <h1 className="text-xl font-semi-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <button className="rounded-md border px-4 py-2 hover:bg-gray-100">
          Logout
        </button>
      </div>
    </header>
  );
}
