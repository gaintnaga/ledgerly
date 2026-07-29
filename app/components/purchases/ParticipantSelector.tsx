"use client";

import { useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email?: string;
}

interface ParticipantSelectorProps {
  users: User[];
  value: string[];
  onChange: (participantIds: string[]) => void;
  totalAmount?: number;
}

export default function ParticipantSelector({
  users,
  value,
  onChange,
  totalAmount = 0,
}: ParticipantSelectorProps) {
  const [selected, setSelected] = useState<string[]>(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const toggleUser = (id: string) => {
    let updated: string[];
    if (selected.includes(id)) {
      updated = selected.filter((userId) => userId !== id);
    } else {
      updated = [...selected, id];
    }
    setSelected(updated);
    onChange(updated);
  };

  const handleSelectAll = () => {
    const allIds = users.map((u) => u.id);
    const updated = selected.length === users.length ? [] : allIds;
    setSelected(updated);
    onChange(updated);
  };

  const sharePerPerson =
    selected.length > 0 ? (totalAmount / selected.length).toFixed(2) : "0.00";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Divide Bill Between (Participants)
          </h3>
          <p className="text-xs text-gray-500">
            Select team members who share this expense.
          </p>
        </div>

        {users.length > 0 && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
          >
            {selected.length === users.length ? "Deselect All" : "Select All"}
          </button>
        )}
      </div>

      {users.length === 0 ? (
        <p className="text-xs text-gray-500 italic">No users found to split bill with.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {users.map((user) => {
            const isChecked = selected.includes(user.id);
            return (
              <label
                key={user.id}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition ${
                  isChecked
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30"
                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleUser(user.id)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white block">
                      {user.name}
                    </span>
                    {user.email && (
                      <span className="text-xs text-gray-400 block">{user.email}</span>
                    )}
                  </div>
                </div>

                {isChecked && (
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    ₹{sharePerPerson}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {selected.length > 0 && totalAmount > 0 && (
        <div className="rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300 flex items-center justify-between">
          <span>
            Split Breakdown: <strong>{selected.length} people</strong>
          </span>
          <span className="font-bold">₹{sharePerPerson} per person</span>
        </div>
      )}
    </div>
  );
}