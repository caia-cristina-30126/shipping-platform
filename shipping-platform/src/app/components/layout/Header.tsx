"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { User } from "next-auth";
import { redirect, usePathname } from "next/navigation";

export default function Header({ user }: { user?: User }) {
    const pathname = usePathname();
    console.log("pathname", pathname)

    const headerItems = [{ name: 'Products', url: 'products' }, { name: 'Orders', url: 'orders' }]
    return (
        <header className="w-full border-b px-6 py-4 bg-background flex items-center justify-between">
            <NavigationMenu>
                <NavigationMenuList>
                    {headerItems.map((item, id) => {
                        const href = `/dashboard/${item.url}`;
                        const isActive =
                            pathname === href || pathname.startsWith(`${href}/`);
                        return <NavigationMenuItem key={id}>
                            <NavigationMenuLink href={href} className={`text-lg font-semibold px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary text-white" : "hover:bg-muted"
                                }`}>
                                {item.name}
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    }

                    )}
                </NavigationMenuList>
            </NavigationMenu>
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                    <Avatar>
                        <AvatarImage src={user?.image || ""} />
                        <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>{user?.name ?? "Anonymous"}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => redirect("/signout")}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
