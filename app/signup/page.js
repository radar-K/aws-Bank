"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TbPigMoney } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  return (
    <div className="h-screen flex justify-center items-center relative bg-white">
      <div className="w-full max-w-sm">
        <form onSubmit={submit} className="flex flex-col gap-6 p-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/signup"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <TbPigMoney className="text-7xl" />
              </div>
            </Link>
            <h1 className="text-xl font-bold">Welcome to Fiffle Banken</h1>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border p-2 rounded-md"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border p-2 rounded-md"
            />
          </div>

          <Button type="submit" className="w-full">
            Create user
          </Button>
        </form>
      </div>
    </div>
  );
}
