import { ClerkProvider } from "@clerk/react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  if (import.meta.env.DEV) {
    throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY. Add it to your .env file.");
  }
  createRoot(document.getElementById("root")!).render(
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: "system-ui, sans-serif",
      background: "#0F172A",
      color: "#F1F5F9",
      textAlign: "center",
    }}>
      <div>
        <h1 style={{ fontSize: "1.25rem", marginBottom: 8 }}>Configuration required</h1>
        <p style={{ color: "#94A3B8", marginBottom: 16 }}>
          Add <code style={{ background: "#1E293B", padding: "2px 6px", borderRadius: 4 }}>VITE_CLERK_PUBLISHABLE_KEY</code> to your Vercel project → Settings → Environment Variables.
        </p>
        <p style={{ fontSize: "0.875rem", color: "#64748B" }}>
          Get the key from <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" style={{ color: "#3B82F6" }}>dashboard.clerk.com</a>
        </p>
      </div>
    </div>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  );
}
