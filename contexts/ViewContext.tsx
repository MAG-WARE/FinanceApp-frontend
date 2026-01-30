"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ViewContextType, ViewContextState, GroupMember } from "@/lib/types";

interface ViewContextData {
  viewContext: ViewContextState;
  setViewOwn: () => void;
  setViewMember: (member: GroupMember) => void;
  setViewAll: () => void;
  isViewingOwn: boolean;
  isViewingMember: boolean;
  isViewingAll: boolean;
  canEdit: boolean;
  canAddOwn: boolean; // Can add own data (true for Own and All views)
  getQueryParams: () => { context?: number; memberUserId?: string };
}

const ViewContext = createContext<ViewContextData>({} as ViewContextData);

const STORAGE_KEY = "@financeapp:viewContext";

export function ViewContextProvider({ children }: { children: ReactNode }) {
  const [viewContext, setViewContext] = useState<ViewContextState>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return { type: ViewContextType.Own };
        }
      }
    }
    return { type: ViewContextType.Own };
  });

  const updateViewContext = useCallback((newContext: ViewContextState) => {
    setViewContext(newContext);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContext));
    }
  }, []);

  const setViewOwn = useCallback(() => {
    updateViewContext({ type: ViewContextType.Own });
  }, [updateViewContext]);

  const setViewMember = useCallback((member: GroupMember) => {
    updateViewContext({
      type: ViewContextType.Member,
      memberUserId: member.userId,
      memberUserName: member.userName,
    });
  }, [updateViewContext]);

  const setViewAll = useCallback(() => {
    updateViewContext({ type: ViewContextType.All });
  }, [updateViewContext]);

  const isViewingOwn = viewContext.type === ViewContextType.Own;
  const isViewingMember = viewContext.type === ViewContextType.Member;
  const isViewingAll = viewContext.type === ViewContextType.All;

  // Can only edit when viewing own data
  const canEdit = isViewingOwn;

  // Can add own data when viewing Own or All
  const canAddOwn = isViewingOwn || isViewingAll;

  const getQueryParams = useCallback(() => {
    if (viewContext.type === ViewContextType.Own) {
      return {};
    }
    if (viewContext.type === ViewContextType.Member && viewContext.memberUserId) {
      return { context: ViewContextType.Member, memberUserId: viewContext.memberUserId };
    }
    if (viewContext.type === ViewContextType.All) {
      return { context: ViewContextType.All };
    }
    return {};
  }, [viewContext]);

  return (
    <ViewContext.Provider
      value={{
        viewContext,
        setViewOwn,
        setViewMember,
        setViewAll,
        isViewingOwn,
        isViewingMember,
        isViewingAll,
        canEdit,
        canAddOwn,
        getQueryParams,
      }}
    >
      {children}
    </ViewContext.Provider>
  );
}

export function useViewContext() {
  const context = useContext(ViewContext);

  if (!context) {
    throw new Error("useViewContext must be used within a ViewContextProvider");
  }

  return context;
}
