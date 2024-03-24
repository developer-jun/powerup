"use client"
//import MenuItem from "../menuitem";
//import { HomeIcon, CubeIcon } from "@radix-ui/react-icons"
//import Link from "next/link"
import ThemeToggle from "../theme-toggle";
import { MainNav } from "./main-nav";
//import { adminConfig } from "@/config/site";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { redirect, useRouter } from "next/navigation"
import { buttonVariants } from "@/components/ui/button";
import { toast } from "../ui/use-toast";

export default function AdminHeader() {
  const router = useRouter()

  const goLogout = async(e) => {
    e.preventDefault();
    console.log("log user out");
    // do API call to logout the user
    try { 
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };  
      // await because we are going to request to the server
      const promise = await fetch('/api/user/logout', options);
      const data = await promise.json();

      console.log(data);
      if(data.status === 'OK') {
        console.log(data.message);
        // setAPIAction('');
        toast({
          title: "Logout Successful",
          description: data.message,
        });
        //form.reset({
        //reset({
        //  email: "",
        //  password: "",
        //});

        // router.push('http://localhost:3000/user/login');
        // redirect('http://localhost:3000/user/login')

        // do a whole page reload to refreshed the layout since now that the user has logout, menu previledge is gone
        window.location.replace('http://localhost:3000/user/login');
      }
    } catch(error) {
      console.log("Error: ");
      console.log(error);
    }
  }

  return (
    /*<div className="flex justify-between mx-2 max-w-6xl sm:mx-auto items-center py-6">
      <div className="flex">
        <MenuItem title="Dashboard" address="/admin" Icon={HomeIcon} />
        <MenuItem title="Products" address="/admin/products" Icon={CubeIcon} />
      </div>
      <div className="flex items-center space-x-5">
        <ThemeToggle />
        <Link href="/">
          <h2 className="text-2xl">
            <span className="font-bold bg-amber-500 py-1 px-2 rounded-lg mr-1">
              eSHOP
            </span>
          </h2>
        </Link>
      </div>
    </div>*/

    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-background">
      <div className="flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 p-5">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger>

              <a
                href="#"
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  <svg className="h-5 w-5 fill-current" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  <span className="sr-only">Profile</span>
                </div>
              </a>

              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={goLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}