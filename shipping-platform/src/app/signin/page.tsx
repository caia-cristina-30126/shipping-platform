import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import { auth, providerMap, signIn } from "@/auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from 'next/image';

const SIGNIN_ERROR_URL = "/error"

export default async function SignInPage(props: {
    searchParams: Promise<{ callbackUrl: string | undefined }>
}) {
    const searchParams = await props.searchParams
    const session = await auth()
    console.log("session page", session)
    if (session) {
        redirect('/')
    }

    return (
        <div className="container flex items-center justify-center min-h-screen py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                    <CardDescription className="text-center">
                        Choose your preferred sign in method
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {Object.values(providerMap).map((provider, key) => (
                        <form
                            action={async () => {
                                "use server"
                                try {
                                    await signIn(provider.id, {
                                        redirectTo: searchParams?.callbackUrl ?? "/",
                                    })
                                } catch (error) {
                                    if (error instanceof AuthError) {
                                        return redirect(`${SIGNIN_ERROR_URL}?error=${error.cause}`)
                                    }
                                    throw error
                                }
                            }}
                            key={key}
                        >
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full flex items-center gap-2"
                            >
                                <Image
                                    src={`https://authjs.dev/img/providers/${provider.id}.svg`}
                                    alt={`${provider.id} logo`}
                                    width={26}
                                    height={26}
                                />
                                Sign in with {provider.name}
                            </Button>
                        </form>
                    ))}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-muted-foreground text-center">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </div>
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                        Return to home
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}