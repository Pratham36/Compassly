"use client";

import { RotateLoader } from "react-spinners";
import { Suspense } from "react";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex flex-col px-5">
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center w-full">
            <RotateLoader size={20} margin={20} color="gray" />
          </div>
        }
      >
        <div className="flex-1 w-full">{children}</div>
      </Suspense>
    </div>
  );
}
