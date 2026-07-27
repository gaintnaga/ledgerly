export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Ledgerly
      </div>
      <nav className="p-4">
        <ul className="space-y-3">
          <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-700">
            Dashboard
          </li>
          <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-700">
            Transactions
          </li>
          <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-700">
            Inventory
          </li>
          <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-700">
            Reports
          </li>
          <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-700">
            Users
          </li>
          <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-700">
            Settings
          </li>
        </ul>
      </nav>
    </aside>
  );
}
