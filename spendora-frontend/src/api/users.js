import { apiRequest } from "./client";

export function createUser(payload) {
  return apiRequest("/users", {
    method: "POST",
    body: payload
  });
}
