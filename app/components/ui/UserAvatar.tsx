"use client";

import { useState } from "react";

interface UserAvatarProps {
  name: string;
  profileImage?: string | null;
  role?: "ADMIN" | "USER" | string;
  size?: "sm" | "md" | "lg";
}

export default function UserAvatar({
  name,
  profileImage,
  role = "USER",
  size = "md",
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const getInitial = (n: string) => {
    return n ? n.charAt(0).toUpperCase() : "?";
  };

  const dimensions =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : size === "lg"
      ? "h-12 w-12 text-base"
      : "h-9 w-9 text-sm";

  const isAdmin = role === "ADMIN";

  if (profileImage && !imgError) {
    return (
      <img
        src={profileImage}
        alt={name || "User Avatar"}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${dimensions} rounded-full object-cover ring-2 ${
          isAdmin ? "ring-purple-500/30" : "ring-indigo-500/30"
        } shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${dimensions} flex shrink-0 items-center justify-center rounded-full font-semibold shadow-sm ${
        isAdmin
          ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
          : "bg-gradient-to-br from-indigo-500 to-blue-600 text-white"
      }`}
    >
      {getInitial(name)}
    </div>
  );
}
