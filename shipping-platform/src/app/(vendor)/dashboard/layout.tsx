import { Suspense } from "react";
import Loading from "./loading";
import Header from "@/app/components/layout/Header";
import { auth } from "@/auth";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    return <>
        <Header user={session?.user} />
        <Suspense fallback={<Loading />}>
            {children}    </Suspense></>
}