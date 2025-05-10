import { redirect } from "next/navigation"

import { AuthError } from "next-auth"
import { signIn } from "@/auth"

const SIGNIN_ERROR_URL = "/error"

export default async function SignInPage(props: {
    searchParams: { a: string | undefined }
}) {
    const filters = (await props.searchParams)
    return (
        <div className="flex flex-col gap-2">
            <form
                action={async () => {
                    "use server"
                    try {
                        await signIn("google", { redirectTo: filters?.a ?? "/", })
                    } catch (error) {

                        if (error instanceof AuthError) {
                            return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                        }
                        throw error
                    }
                }}
            >
                <button type="submit">
                    <span>Sign in with google</span>
                </button>
            </form>
        </div>
    )
}