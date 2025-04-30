"use client"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { useState } from "react"

export const SearchInput = () => {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')

    const handleSubmit = (e: any) => {
        if (e.key === "Enter") {
            if (searchQuery) return router.replace(`/dashboard/products?q=${searchQuery}`);

            if (!searchQuery) return router.replace("/")
        }
    }

    return <Input
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => handleSubmit(e)}
        className="max-w-sm"
    />
}