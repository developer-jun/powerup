export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Next.js",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}

export const adminConfig = {
  name: "eShop",
  description:
    "My NextJS learning Playground",
  mainNav: [
    {
      title: "Visit Store Front",
      href: "/",
    },    
  ],
  frontendNav: [
    {
      title: "Home",
      href: "/admin",
    },
    {
      title: "Category",
      href: "/admin/category",
    },
    {
      title: "Product",
      href: "/admin/products",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
  sidebarMenu: [
    {
      id: 1,
      title: "Quick Links",
      listItems: [
        {
          id: 1,
          title: "Dashboard",
          url: "/admin",
          icon: "home.svg",
        },
        {
          id: 2,
          title: "Profile",
          url: "/users/1",
          icon: "user.svg",
        },
      ],
    },
    {
      id: 2,
      title: "MAIN",
      listItems: [        
        {
          id: 1,
          title: "Products",
          url: "/admin/products",
          icon: "product.svg",
        },
        {
          id: 2,
          title: "Options",
          url: "/admin/options",
          icon: "expand.svg",
        },
        {
          id: 3,
          title: "Categories",
          url: "/admin/category",
          icon: "element.svg",
        },
        {
          id: 4,
          title: "Tags",
          url: "/admin/tags",
          icon: "view.svg",
        },
        {
          id: 5,
          title: "Orders",
          url: "/admin/orders",
          icon: "order.svg",
        },
        {
          id: 6,
          title: "Users",
          url: "/admin/users",
          icon: "user.svg",
        },
      ],
    },
    {
      id: 3,
      title: "General",
      listItems: [
        {
          id: 1,
          title: "Settings",
          url: "/",
          icon: "setting.svg",
        },
        {
          id: 2,
          title: "Backups",
          url: "/",
          icon: "backup.svg",
        },
        {
          id: 3,
          title: "Logs",
          url: "/",
          icon: "log.svg",
        },
      ],
    },    
  ],
  links: {
    twitter: "https://twitter.com/",
    github: "https://github.com/",
    docs: "https://ui.shadcn.com",
  },
}

