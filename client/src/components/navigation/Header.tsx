"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { ModeToggle } from "../toggle-button";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

import React from "react";
import {
  fetchCurrentUser,
  logout,
  selectCurrentUser,
} from "@/app/store/features/authSlice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/app/api-services/auth-services";

export default function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    const init = async () => {
      await dispatch(fetchCurrentUser());
    };
    init();
  }, [dispatch]);

  {
    loading && <p>Loading...</p>;
  }

  const router = useRouter();

  const onLogout = async () => {
    try {
      // 1️⃣ Redux ya state se logout
      await dispatch(logout());
      await logoutUser();

      // 2️⃣ Backend API ko call karke token clear karna
      const res = await fetch("/api/clear-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      // console.log(data.message); // "Token cleared"

      // 3️⃣ Page refresh (ya UI update)
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
      <div className=' px-6 flex h-14 items-center justify-between'>
        <Link href='/' className='flex items-center gap-2 font-semibold'>
          <span className='inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white shadow-sm'>
            AI
          </span>
          <span>AI StudyMate</span>
        </Link>
        <nav className='flex items-center gap-2'>
          <Link
            href='/review'
            className={cn(
              "text-sm font-medium px-3 py-2 rounded-md hover:bg-blue-50"
            )}
          >
            Review
          </Link>
          {user ? (
            <>
              <Link
                href='/dashboard'
                className={cn(
                  "text-sm font-medium px-3 py-2 rounded-md hover:bg-blue-50"
                )}
              >
                Dashboard
              </Link>
              <Button variant='outline' onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <a
                href='/login'
                className='text-sm font-medium px-3 py-2 rounded-md hover:bg-blue-50'
              >
                Login
              </a>
              {/* <ModeToggle /> */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
