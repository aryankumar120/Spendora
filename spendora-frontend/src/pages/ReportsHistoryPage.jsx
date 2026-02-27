import { useQuery } from "@tanstack/react-query";
import { fetchOptimizationReports } from "../api/optimize";
import { useUserContext } from "../context/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Skeleton } from "../components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { formatCurrency, formatDate, normalizeBillingCycle } from "../hooks/useFormatters";

export default function ReportsHistoryPage() {
  const { userId } = useUserContext();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reports", userId],
    queryFn: () => fetchOptimizationReports(userId),
    enabled: !!userId
  });

  const reports = data || [];

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Optimization Reports History</CardTitle>
          <CardDescription>Browse historical reports and inspect each breakdown.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-3">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          ) : isError ? (
            <Alert variant="error">
              <AlertTitle>Unable to load reports</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ) : reports.length === 0 ? (
            <Alert>
              <AlertTitle>No reports available</AlertTitle>
              <AlertDescription>Generate a report in the Optimization page to populate history.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-white p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-900">
                      Generated {formatDate(report.generatedAt)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Monthly: {formatCurrency(report.totalMonthlyCost)} · Yearly: {formatCurrency(report.totalYearlyCost)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={report.highCostCount > 0 ? "danger" : "success"}>
                      {report.highCostCount} High-Cost
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View Details</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Report Details</DialogTitle>
                        </DialogHeader>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Service</TableHead>
                              <TableHead>Billing</TableHead>
                              <TableHead>Monthly</TableHead>
                              <TableHead>Yearly</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Suggestion</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {report.reportData.map((item) => (
                              <TableRow key={`${report.id}-${item.serviceName}`}>
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
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
