'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="container flex items-center justify-center min-h-screen py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Something went wrong</CardTitle>
                    <CardDescription className="text-center">
                        We encountered an error while processing your request
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                            {error.message || "An unexpected error occurred. Please try again."}
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button 
                        onClick={() => reset()}
                        className="w-full"
                    >
                        Try Again
                    </Button>
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                        Return to home
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}