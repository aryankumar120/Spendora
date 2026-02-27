import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSubscriptions, createSubscription } from "../api/subscriptions";
import { useUserContext } from "../context/UserContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";
import { formatCurrency, formatDate, normalizeBillingCycle } from "../hooks/useFormatters";

const initialForm = {
  serviceName: "",
  cost: "",
  billingCycle: "MONTHLY",
  nextBillingDate: ""
};

function calculateMonthlyCost(subscription) {
  const cost = Number(subscription.cost || 0);
  return subscription.billingCycle === "YEARLY" ? cost / 12 : cost;
}

function calculateYearlyCost(subscription) {
  const cost = Number(subscription.cost || 0);
  return subscription.billingCycle === "MONTHLY" ? cost * 12 : cost;
}

export default function SubscriptionDashboardPage() {
  const { userId, activeUser } = useUserContext();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subscriptions", userId],
    queryFn: () => fetchSubscriptions(userId),
    enabled: !!userId
  });

  const mutation = useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", userId] });
      setForm(initialForm);
      setIsOpen(false);
    }
  });

  const subscriptions = useMemo(() => data || [], [data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({
      userId,
      serviceName: form.serviceName.trim(),
      cost: Number(form.cost),
      billingCycle: form.billingCycle,
      nextBillingDate: form.nextBillingDate
    });
  };

  const canSubmit = form.serviceName.trim() && form.cost && form.billingCycle && form.nextBillingDate;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Dashboard</CardTitle>
          <CardDescription>
            Manage subscriptions for {activeUser?.name || "your user profile"}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-600">Total subscriptions</p>
            <p className="text-2xl font-semibold text-slate-900">{subscriptions.length}</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add Subscription</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Subscription</DialogTitle>
              </DialogHeader>
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Service Name</label>
                  <Input
                    value={form.serviceName}
                    onChange={(event) => setForm((prev) => ({ ...prev, serviceName: event.target.value }))}
                    placeholder="Netflix"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Cost</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.cost}
                    onChange={(event) => setForm((prev) => ({ ...prev, cost: event.target.value }))}
                    placeholder="15.99"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Billing Cycle</label>
                  <Select
                    value={form.billingCycle}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, billingCycle: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Next Billing Date</label>
                  <Input
                    type="date"
                    value={form.nextBillingDate}
                    onChange={(event) => setForm((prev) => ({ ...prev, nextBillingDate: event.target.value }))}
                  />
                </div>
                {mutation.isError && (
                  <Alert variant="error">
                    <AlertTitle>Unable to add subscription</AlertTitle>
                    <AlertDescription>{mutation.error.message}</AlertDescription>
                  </Alert>
                )}
                <DialogFooter>
                  <Button type="submit" disabled={!canSubmit || mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Save Subscription"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>Review billing cycles, costs, and upcoming renewals.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-3">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          ) : isError ? (
            <Alert variant="error">
              <AlertTitle>Unable to load subscriptions</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ) : subscriptions.length === 0 ? (
            <Alert>
              <AlertTitle>No subscriptions yet</AlertTitle>
              <AlertDescription>Add your first subscription to see optimization insights.</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Billing</TableHead>
                  <TableHead>Monthly Cost</TableHead>
                  <TableHead>Yearly Cost</TableHead>
                  <TableHead>Next Billing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium text-slate-900">{sub.serviceName}</TableCell>
                    <TableCell>{normalizeBillingCycle(sub.billingCycle)}</TableCell>
                    <TableCell>{formatCurrency(calculateMonthlyCost(sub))}</TableCell>
                    <TableCell>{formatCurrency(calculateYearlyCost(sub))}</TableCell>
                    <TableCell>{formatDate(sub.nextBillingDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
