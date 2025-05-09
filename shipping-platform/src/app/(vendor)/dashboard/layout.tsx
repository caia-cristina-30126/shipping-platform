import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    console.log("session layout", session)

    if (!session?.user) {
        redirect("/api/auth/signin");
    }
    return <Suspense fallback={<Loading />}>
        {children}    </Suspense>
}