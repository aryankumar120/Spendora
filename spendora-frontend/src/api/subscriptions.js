import { apiRequest } from "./client";

export function fetchSubscriptions(userId) {
  return apiRequest(`/subscriptions/user/${userId}`);
}

export function createSubscription(payload) {
  return apiRequest("/subscriptions", {
    method: "POST",
    body: payload
  });
}
