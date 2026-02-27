import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const UserContext = createContext(null);

const USERS_KEY = "spendora.users";
const ACTIVE_USER_KEY = "spendora.activeUserId";

function readStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function readActiveUserId() {
  try {
    return localStorage.getItem(ACTIVE_USER_KEY) || null;
  } catch (error) {
    return null;
  }
}

export function UserProvider({ children }) {
  const [users, setUsers] = useState(readStoredUsers);
  const [userId, setUserId] = useState(readActiveUserId);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(ACTIVE_USER_KEY, userId);
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  }, [userId]);

  const activeUser = useMemo(() => users.find((user) => user.id === userId) || null, [users, userId]);

  const addUser = (user) => {
    setUsers((prev) => {
      const exists = prev.find((item) => item.id === user.id);
      if (exists) {
        return prev.map((item) => (item.id === user.id ? user : item));
      }
      return [user, ...prev];
    });
  };

  const selectUser = (id) => {
    setUserId(id);
  };

  const clearUser = () => {
    setUserId(null);
  };

  const value = {
    userId,
    users,
    activeUser,
    addUser,
    selectUser,
    clearUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return context;
}
