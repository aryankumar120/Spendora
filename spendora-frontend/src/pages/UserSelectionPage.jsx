import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/users";
import { useUserContext } from "../context/UserContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";

export default function UserSelectionPage() {
  const navigate = useNavigate();
  const { users, addUser, selectUser, userId } = useUserContext();
  const [form, setForm] = useState({ name: "", email: "" });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      addUser(data);
      selectUser(data.id);
      navigate("/dashboard");
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ name: form.name.trim(), email: form.email.trim() });
  };

  const isDisabled = !form.name.trim() || !form.email.trim();

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Select or Create a User</CardTitle>
          <CardDescription>
            For this demo, create a new user or pick a previously created user stored in this browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form className="grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Name</label>
              <Input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Alex Johnson"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="alex@company.com"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={isDisabled || mutation.isPending} className="w-full">
                {mutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>

          {mutation.isError && (
            <Alert variant="error">
              <AlertTitle>Unable to create user</AlertTitle>
              <AlertDescription>{mutation.error.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Users</CardTitle>
          <CardDescription>Select a user to continue into the dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Separator />
          {mutation.isPending && users.length === 0 ? (
            <div className="grid gap-3">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : users.length === 0 ? (
            <Alert>
              <AlertTitle>No users yet</AlertTitle>
              <AlertDescription>Create a user above to get started.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Button
                    variant={userId === user.id ? "subtle" : "outline"}
                    onClick={() => {
                      selectUser(user.id);
                      navigate("/dashboard");
                    }}
                  >
                    {userId === user.id ? "Active" : "Select"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
