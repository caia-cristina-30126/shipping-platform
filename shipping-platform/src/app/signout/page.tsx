import { signOut } from "@/auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SignOutPage() {
    return (
        <div className="container flex items-center justify-center min-h-screen py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign Out</CardTitle>
                    <CardDescription className="text-center">
                        Are you sure you want to sign out?
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    <form
                        action={async () => {
                            "use server"
                            await signOut({ redirectTo: "/" })
                        }}
                    >
                        <Button type="submit" variant="destructive" className="w-full">
                            Yes, sign me out
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <Link href="/" className="w-full">
                        <Button variant="outline" className="w-full">
                            Cancel
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}