"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Eye, EyeOff } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function NavMain({ items }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false); // Ny state för att växla mellan login/signup
  const router = useRouter();

  // Kontrollera om användaren redan är inloggad
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setLoggedInUser(storedUsername);
    }
  }, []);

  // Login funktionalitet - samma som din LoginForm
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Debug: visa vad som skickas till servern
    console.log("Skickar login data:", { username, password });

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // Debug: visa server response
      console.log("Server response status:", response.status);
      console.log("Server response statusText:", response.statusText);

      const data = await response.json();
      console.log("Server response data:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        setIsLoggedIn(true);
        setLoggedInUser(data.user.username);
        // Rensa formuläret
        setUsername("");
        setPassword("");
        setError("");
        router.push("/dashboard");
      } else {
        setError("Felaktigt användarnamn eller lösenord.");
        console.error("Fel från servern:", response.statusText);
      }
    } catch (error) {
      setError("Serverfel. Försök igen senare.");
      console.error("Fel vid fetch-anrop:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Kontrollera lösenordsvalidering för signup
  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setError("Lösenorden matchar inte.");
      return false;
    }
    setError("");
    return true;
  };

  // Signup funktionalitet - samma som din Signup komponent
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username) {
      setError("Användarnamn får inte vara tomt.");
      setIsLoading(false);
      return;
    }

    if (!validatePasswords()) {
      setIsLoading(false);
      return;
    }

    // Debug: visa vad som skickas till servern
    console.log("Skickar signup data:", { username, password });

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Debug: visa server response
      console.log("Signup response status:", response.status);

      const data = await response.json();
      console.log("Signup response data:", data);

      if (response.ok) {
        console.log("User created successfully:", data);
        localStorage.setItem(
          "user",
          JSON.stringify({ username: data.username, id: data.id })
        );
        // Växla tillbaka till login-läge efter framgångsrik registrering
        setIsSignupMode(false);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        // Visa success meddelande
        setError("Account created!");
      } else {
        setError(data.message || "Något gick fel. Försök igen.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setError(
        "Serverfel. Kontrollera att backend-servern körs och försök igen."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Växla mellan login och signup läge
  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  // Logout funktionalitet
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setLoggedInUser("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setIsSignupMode(false);
    router.push("/");
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {/* Special hantering för Login */}
                  {item.title === "Login" ? (
                    <div className="p-3 space-y-3">
                      {isLoggedIn ? (
                        // Visa inloggad användare och logout knapp
                        <div className="space-y-3">
                          <div className="text-sm text-green-600">
                            ✓ Inloggad som:{" "}
                            <span className="font-medium">{loggedInUser}</span>
                          </div>
                          <Button
                            onClick={handleLogout}
                            size="sm"
                            variant="outline"
                            className="w-full h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Logga ut
                          </Button>
                        </div>
                      ) : isSignupMode ? (
                        // Visa signup formulär
                        <form onSubmit={handleSignup} className="space-y-3">
                          <div className="space-y-1">
                            <Label
                              htmlFor="sidebar-signup-username"
                              className="text-xs"
                            >
                              Username
                            </Label>
                            <Input
                              id="sidebar-signup-username"
                              type="text"
                              placeholder=""
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="h-8 text-sm"
                              required
                              disabled={isLoading}
                            />
                          </div>

                          <div className="space-y-1">
                            <Label
                              htmlFor="sidebar-signup-password"
                              className="text-xs"
                            >
                              Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="sidebar-signup-password"
                                type={showPassword ? "text" : "password"}
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-8 text-sm pr-8"
                                required
                                disabled={isLoading}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-8 w-8 px-0"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-3 w-3" />
                                ) : (
                                  <Eye className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label
                              htmlFor="sidebar-confirm-password"
                              className="text-xs"
                            >
                              Confirm password
                            </Label>
                            <Input
                              id="sidebar-confirm-password"
                              type={showPassword ? "text" : "password"}
                              placeholder=""
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              onBlur={validatePasswords}
                              className="h-8 text-sm"
                              required
                              disabled={isLoading}
                            />
                          </div>

                          {error && (
                            <p
                              className={`text-xs ${
                                error.includes("skapat")
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {error}
                            </p>
                          )}

                          <Button
                            type="submit"
                            size="sm"
                            className="w-full h-8 text-xs"
                            disabled={isLoading}
                          >
                            {isLoading ? "Skapar konto..." : "Create account"}
                          </Button>

                          <div className="text-center">
                            <button
                              type="button"
                              onClick={toggleMode}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Already have an account? Sign in
                            </button>
                          </div>
                        </form>
                      ) : (
                        // Visa login formulär
                        <form onSubmit={handleLogin} className="space-y-3">
                          <div className="space-y-1">
                            <Label
                              htmlFor="sidebar-username"
                              className="text-xs"
                            >
                              Username
                            </Label>
                            <Input
                              id="sidebar-username"
                              type="text"
                              placeholder=""
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="h-8 text-sm"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <Label
                              htmlFor="sidebar-password"
                              className="text-xs"
                            >
                              Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="sidebar-password"
                                type={showPassword ? "text" : "password"}
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-8 text-sm pr-8"
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-8 w-8 px-0"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-3 w-3" />
                                ) : (
                                  <Eye className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {error && (
                            <p className="text-red-500 text-xs">{error}</p>
                          )}

                          <Button
                            type="submit"
                            size="sm"
                            className="w-full h-8 text-xs"
                            disabled={isLoading}
                          >
                            {isLoading ? "Logging in..." : "Log In"}
                          </Button>

                          <div className="text-center">
                            <button
                              type="button"
                              onClick={toggleMode}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Don't have an account? <br /> Sign up
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ) : (
                    /* Normal hantering för alla andra items */
                    item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
