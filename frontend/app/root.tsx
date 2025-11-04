import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router";
import { useEffect, useState } from "react";
import type { Route } from "./+types/root";
import { AppProvider, useApp } from "./state/useApp";
import { Loader2 } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import "./app.css";

const mockGetSession = () => {
  // Simulate an API call to check session
  return new Promise((resolve) => {
    setTimeout(() => {
      const sessionCookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("sid="));
      const valid = !!sessionCookie;
      const mockUserData = { name: "Mei", email: "111@gmail.com", avatar: "" };
      resolve({
        valid,
        ...(valid ? mockUserData : null),
      });
    }, 500);
  });
};

// export const links: Route.LinksFunction = () => [
//   { rel: "preconnect", href: "https://fonts.googleapis.com" },
//   {
//     rel: "preconnect",
//     href: "https://fonts.gstatic.com",
//     crossOrigin: "anonymous",
//   },
//   {
//     rel: "stylesheet",
//     href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
//   },
// ];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AuthGate>
        <Outlet />
      </AuthGate>
    </AppProvider>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const { onLogin } = useApp();

  useEffect(() => {
    mockGetSession().then((data: any) => {
      if (data.valid) {
        onLogin(data.name, data.email, data.avatar);
        console.log("Valid session", data.name, data.email, data.avatar);
      } else {
        const isLoginPage = location.pathname === "/";
        if (!isLoginPage) {
          navigate("/", { replace: true });
        }
      }
      setChecking(false);
    });
  }, [location.pathname]);

  if (checking) {
    return <div className="h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
    </div>;
  }

  return <>{children}</>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
