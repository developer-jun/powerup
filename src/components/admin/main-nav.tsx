import * as React from "react"
// import Link from "next/link"

import { NavItem } from "@/types/nav"
import { adminConfig } from "@/config/site"
import { cn } from "@/utils/utils"
import { CodeIcon } from "@radix-ui/react-icons"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav() {
  return (
    <div id="main-nav" className="flex gap-6 md:gap-10">
      <a href="/" className="flex items-center space-x-2">
        <CodeIcon className="h-6 w-6 text-indigo-400 font-bold" />
        <span className="inline-block font-bold text-indigo-600">{adminConfig.name}</span>
      </a>
      {adminConfig.mainNav?.length ? (
        <nav className="flex gap-6">
          {adminConfig.mainNav?.map(
            (item, index) =>
              item.href && (
                <a
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </a>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
