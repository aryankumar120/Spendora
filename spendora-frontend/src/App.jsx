import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { API_BASE_URL } from "./api/client";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {!API_BASE_URL && (
        <div className="mx-auto w-full max-w-6xl px-6 py-4">
          <Alert variant="warning">
            <AlertTitle>Missing API Base URL</AlertTitle>
            <AlertDescription>
              Set VITE_API_BASE_URL in the .env file to connect to the Spendora backend.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <AppRoutes />
      </main>
    </div>
  );
}
