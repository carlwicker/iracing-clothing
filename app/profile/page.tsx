import React from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return <p>You need to log in to view this page.</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {session.user?.name}!</p>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}
