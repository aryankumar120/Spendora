import { apiRequest } from "./client";

export function generateOptimizationReport(userId) {
  return apiRequest(`/optimize/user/${userId}/generate`, {
    method: "POST"
  });
}

export function fetchOptimizationReports(userId) {
  return apiRequest(`/optimize/user/${userId}/reports`);
}
