
import { adminConfig } from "@/config/site";
import AdminNavbar from "@/components/blocks/header/navbar";
import Footer from "@/components/blocks/footer/footer";

export default function StorefrontLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <>
      <AdminNavbar siteInfo={{name: adminConfig.name, mainNav: adminConfig.frontendNav}} />
      <div className="container">
        <main className="main">{children}</main>
      </div>
      <Footer />
    </>
  )
}           
