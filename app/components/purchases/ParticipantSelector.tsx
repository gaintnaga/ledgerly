"use client";

import { useEffect, useState } from "react";

export interface User {
  id: number;
  name: string;
}

interface ParticipantSelectorProps {
  users: User[];
  value: number[];
  onChange: (participants: number[]) => void;
}

export default function ParticipantSelector({
  users,
  value,
  onChange,
}: ParticipantSelectorProps) {
  const [selected, setSelected] = useState<number[]>(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const toggleUser = (id: number) => {
    let updated: number[];

    if (selected.includes(id)) {
      updated = selected.filter((userId) => userId !== id);
    } else {
      updated = [...selected, id];
    }

    setSelected(updated);
    onChange(updated);
  };

  return (
    <div>
      <label className="mb-3 block text-sm font-semibold">
        Participants
      </label>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {users.map((user) => (
          <label
            key={user.id}
            className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={selected.includes(user.id)}
              onChange={() => toggleUser(user.id)}
              className="h-4 w-4"
            />

            <span>{user.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}