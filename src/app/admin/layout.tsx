import '../globals.scss'
import { fontSans } from "@/utils/fonts"
import { cn } from "@/utils/utils"
// import { ThemeContextProvider } from "@/components/theme-provider"
import { ThemeContextProvider } from "@/context/theme-context"
import GuardianLayout from '@/components/layout/guard-layout'
import { StrictMode } from 'react'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <StrictMode>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable
            )}>
          <ThemeContextProvider>
            <GuardianLayout>{children}</GuardianLayout>
          </ThemeContextProvider>        
        </body>
      </html>
    </StrictMode>
  )
}
