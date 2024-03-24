import { getServerSession } from "next-auth";

import { authOptions } from "@/utils/auth";
import { adminConfig } from "@/config/site"
import Navbar from "@/components/blocks/header/navbar";
import AdminSidebar from "@/components/admin/sidebar/admin-sidebar";
import Footer from "@/components/blocks/footer/footer";
import RestrictedAccess from "@/components/admin/restricted/restricted-access";
import "@/components/admin/admin-styles.scss";

export default async function GuardianLayout({
  children,
  }: {
    children: React.ReactNode
  }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="page-container">        
      {(!session || !session?.user || session?.user === undefined) ? (
        <>
          <RestrictedAccess />
        </>
      ) : (
        <>
          <Navbar siteInfo={{name: adminConfig.name, mainNav: adminConfig.mainNav}} />
          <div className="main-container">
            <AdminSidebar sidebarMenu={adminConfig.sidebarMenu} />       
            <main className="main">
              {children}           
            </main>
          </div>
          <Footer />
        </>
      )}
    </div>  
  );  
}