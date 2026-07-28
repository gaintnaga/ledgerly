export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Demo
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-700">
            📊 Dashboard
          </li>

          <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-700">
            🛒 Purchases
          </li>

          <li className="ml-4 cursor-pointer rounded-md px-3 py-2 text-gray-300 hover:bg-gray-700">
            • All Purchases
          </li>

          <li className="ml-4 cursor-pointer rounded-md px-3 py-2 text-gray-300 hover:bg-gray-700">
            • Add Purchase
          </li>

          <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-700">
            📦 Inventory
          </li>

          <li className="ml-4 cursor-pointer rounded-md px-3 py-2 text-gray-300 hover:bg-gray-700">
            • Stock
          </li>

          <li className="ml-4 cursor-pointer rounded-md px-3 py-2 text-gray-300 hover:bg-gray-700">
            • Categories
          </li>

          <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-700">
            👥 Users
          </li>

          <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-700">
            📈 Reports
          </li>

          <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-700">
            ⚙️ Settings
          </li>
        </ul>
      </nav>
    </aside>
  );
}
