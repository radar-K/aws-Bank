"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { TbPigMoney } from "react-icons/tb";
import { PiNumpadDuotone } from "react-icons/pi";
import { FaRegIdBadge } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // hindrar vi den traditionella sidomladdningen som sker vid formulärinlämning och istället hanterar vi inlämningen asynkront med JavaScript.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Skicka en POST-begäran till backend för att logga in användaren
      const response = await fetch("http://localhost:3001/login", {
        // hämtar
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Vi talar om för servern att skicka och ta emot JSON
        },
        body: JSON.stringify({ username, password }), // Hämtar från useState, och skickar användarnamn och lösenord som JSON till backend
      });

      const data = await response.json();

      //response.ok är true om servern svarade med en lyckad statuskod (200–299).
      // data.length > 0 kontrollerar om servern returnerade matchande användardata, vilket innebär att inloggningen lyckades.
      if (response.ok && data.length > 0) {
        router.push("/dashboard");
      } else {
        setError("Felaktigt användarnamn eller lösenord.");
      }
    } catch (error) {
      setError("Serverfel. Försök igen senare.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/*Skickar till funktionen handleSubmit som pratar med backend*/}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <TbPigMoney className="text-7xl" />
              </div>
            </Link>
            <h1 className="text-xl font-bold">Wälcome to Fiffel Banken</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="username"
                type="text"
                placeholder="m@example.com"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 rounded-md"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>{" "}
              <input
                id="password"
                type="password"
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded-md"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" type="button" className="w-full">
              <FaRegIdBadge />
              BankId
            </Button>
            <Button variant="outline" type="button" className="w-full">
              <PiNumpadDuotone />
              Bankdosa
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our Terms of Service and Privacy
        Policy.
      </div>
    </div>
  );
}
