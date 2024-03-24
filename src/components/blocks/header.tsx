import MenuItem from "../menuitem";
import { HomeIcon, CubeIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import ThemeToggle from "../theme-toggle";
import { CodeIcon } from "@radix-ui/react-icons"
import { cn } from "@/utils/utils"

export default function Header(props) {
  const { siteInfo } = props;

  return (
    <header className="navbar">      
      <a href="/" className="logo">
        <CodeIcon className="icon" />
        <span>{siteInfo.name}</span>
      </a>        
      <nav className="menu-bar">
        <ul>
          {siteInfo.mainNav?.length ? (            
            siteInfo.mainNav?.map((item, index) => (
                <li><a
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </a></li>
              )
            )            
          ) : null}
        </ul>        
        <ThemeToggle />
      </nav>
    </header>

    
  )
}

{/*
    <div className="flex justify-between mx-2 max-w-6xl sm:mx-auto items-center py-6">
      <div className="flex">
        <MenuItem title="HOME" address="/" Icon={HomeIcon} />
        <MenuItem title="ABOUT" address="/about" Icon={CubeIcon} />
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
    </div>
    */}