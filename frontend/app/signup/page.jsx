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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Kontrollera lösenordsvalidering
  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setErrorMessage("Lösenorden matchar inte.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  // Hantera formulärinlämning
  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username) {
      setErrorMessage("Användarnamn får inte vara tomt.");
      setIsLoading(false);
      return;
    }

    if (!validatePasswords()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://13.49.18.194:3001", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User created successfully:", data);
        // Store user data in localStorage or sessionStorage for persistence
        localStorage.setItem(
          "user",
          JSON.stringify({ username: data.username, id: data.id })
        );
        // Redirect to dashboard
        router.push("/login");
      } else {
        setErrorMessage(data.message || "Något gick fel. Försök igen.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage(
        "Serverfel. Kontrollera att backend-servern körs och försök igen."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center relative">
      <div className="w-full max-w-sm">
        <form onSubmit={submit} className="flex flex-col">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-12 items-center justify-center rounded-md">
                <TbPigMoney className="text-6xl" />
              </div>
            </Link>
            <h1 className="text-xl font-bold">Wälcome to Fiffel Banken</h1>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
          <div className="grid gap-3 pb-4">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="m@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border p-2 rounded-md"
              disabled={isLoading}
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
              disabled={isLoading}
            />

            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validatePasswords}
              required
              className="border p-2 rounded-md"
              disabled={isLoading}
            />

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
          </div>

          <div className="p-4"></div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating user..." : "Create user"}
          </Button>
        </form>
      </div>
    </div>
  );
}
