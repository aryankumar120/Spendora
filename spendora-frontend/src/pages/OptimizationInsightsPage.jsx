import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateOptimizationReport, fetchOptimizationReports } from "../api/optimize";
import { useUserContext } from "../context/UserContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { formatCurrency, normalizeBillingCycle } from "../hooks/useFormatters";

export default function OptimizationInsightsPage() {
  const { userId } = useUserContext();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(false);
  const [lastReportId, setLastReportId] = useState(null);

  const {
    data: reports,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["reports", userId],
    queryFn: () => fetchOptimizationReports(userId),
    enabled: !!userId,
    refetchInterval: processing ? 2000 : false
  });

  const latestReport = useMemo(() => (reports && reports.length > 0 ? reports[0] : null), [reports]);

  const generateMutation = useMutation({
    mutationFn: () => generateOptimizationReport(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", userId] });
      refetch();
    },
    onError: () => {
      setProcessing(false);
    }
  });

  const handleGenerate = () => {
    setProcessing(true);
    setLastReportId(latestReport?.id || null);
    generateMutation.mutate();
  };

  useEffect(() => {
    if (!processing) return;
    if (latestReport && latestReport.id !== lastReportId) {
      setProcessing(false);
    }
  }, [processing, latestReport, lastReportId]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Optimization Insights</CardTitle>
          <CardDescription>Generate asynchronous reports to spot high-cost subscriptions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={handleGenerate} disabled={generateMutation.isPending || processing}>
            {processing ? "Processing..." : "Generate Optimization Report"}
          </Button>
          {processing && (
            <Alert variant="warning">
              <AlertTitle>Processing in background</AlertTitle>
              <AlertDescription>
                The optimization job is running asynchronously. This page will refresh when the report is ready.
              </AlertDescription>
            </Alert>
          )}
          {generateMutation.isError && (
            <Alert variant="error">
              <AlertTitle>Unable to generate report</AlertTitle>
              <AlertDescription>{generateMutation.error.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest Report</CardTitle>
          <CardDescription>Review totals, high-cost items, and recommendations.</CardDescription>
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
              <AlertTitle>Unable to load reports</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ) : !latestReport ? (
            <Alert>
              <AlertTitle>No optimization report yet</AlertTitle>
              <AlertDescription>Generate your first report to see savings opportunities.</AlertDescription>
            </Alert>
          ) : (
            <Tabs defaultValue="summary">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Detailed Breakdown</TabsTrigger>
              </TabsList>
              <TabsContent value="summary">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-border bg-white p-4">
                    <p className="text-sm text-slate-600">Total Monthly Cost</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {formatCurrency(latestReport.totalMonthlyCost)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-white p-4">
                    <p className="text-sm text-slate-600">Total Yearly Cost</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {formatCurrency(latestReport.totalYearlyCost)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-white p-4">
                    <p className="text-sm text-slate-600">High-Cost Subscriptions</p>
                    <p className="text-xl font-semibold text-slate-900">{latestReport.highCostCount}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="details">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Billing</TableHead>
                      <TableHead>Monthly Cost</TableHead>
                      <TableHead>Yearly Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Suggestion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {latestReport.reportData.map((item) => (
                      <TableRow key={item.serviceName} className={item.isHighCost ? "bg-orange-50" : ""}>
                        <TableCell className="font-medium text-slate-900">{item.serviceName}</TableCell>
                        <TableCell>{normalizeBillingCycle(item.billingCycle)}</TableCell>
                        <TableCell>{formatCurrency(item.monthlyCost)}</TableCell>
                        <TableCell>{formatCurrency(item.yearlyCost)}</TableCell>
                        <TableCell>
                          {item.isHighCost ? <Badge variant="danger">High cost</Badge> : <Badge variant="success">Normal</Badge>}
                        </TableCell>
                        <TableCell className="text-slate-600">{item.suggestion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
