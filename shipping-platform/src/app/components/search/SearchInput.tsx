"use client";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomButton } from "../common/CustomButton";

export const SearchInput = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSubmit = () => {
        if (!searchQuery) return router.replace(`/dashboard/products`);;

        return router.replace(`/dashboard/products?q=${searchQuery}`);
    };

    return (
        <div className="flex justify-between items-center mb-6 max-w-lg">
            <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
            />
            <CustomButton text={"Search"} onClick={() => handleSubmit()} />
        </div>
    );
};
