"use client";

import dynamic from "next/dynamic";

const DynamicScene = dynamic(() => import("./Scene"), { ssr: false });

export default function ClientScene() {
  return <DynamicScene />;
}
