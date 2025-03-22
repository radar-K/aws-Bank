"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();

    console.log("skickar skapa användare");

    const response = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    console.log("data", data);

    if (response.ok) {
      alert("Användaren skapad");
    } else {
      alert("Fel vid skapande av användare");
    }

    // Just for now, let's simulate a successful response
    alert("Användaren skapad (simulerad, backend inte implementerad än)");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="h-screen flex justify-center items-center relative">
      <div className="w-full max-w-sm">
        <h1 className="text-center mb-4 text-3xl">Skapa konto</h1>

        <form
          onSubmit={submit}
          className="flex flex-col gap-4 p-6 border rounded-lg shadow-md bg-white"
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Create user
          </button>
        </form>
        <button
          onClick={handleGoBack}
          className="absolute top-4 left-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Go back
        </button>
      </div>
    </div>
  );
}
