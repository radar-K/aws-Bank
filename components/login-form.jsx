"use client";

import Link from "next/link";
import { TbPigMoney } from "react-icons/tb";
import { PiNumpadDuotone } from "react-icons/pi";
import { FaRegIdBadge } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
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
            <h1 className="text-xl font-bold">Welcome to Fiffel Banken</h1>
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
                id="email"
                type="text"
                placeholder="m@example.com"
                required
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
                className="border p-2 rounded-md"
              />
            </div>

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
