import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, LayoutDashboard, LogOut, Menu, Plus, UserRound, UsersRound, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const destinations = [
  { to: "/explore", label: "Explore" },
  { to: "/create-listing", label: "Post a Listing" },
  { to: "/looking-to-join/create", label: "Looking to Join" },
] as const;

function Brand({ onClick }: { onClick?: () => void }) {
  const { user } = useAuth();
  return <Link to={user ? "/dashboard" : "/"} onClick={onClick} className="inline-flex shrink-0 items-center gap-2.5 text-xl font-extrabold" aria-label="TeamFit home">
    <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><UsersRound className="size-5" /></span>
    Team<span className="-ml-2.5 text-primary">Fit</span>
  </Link>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, signOut, requireAuth } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const displayName: unknown = user?.user_metadata?.["display_name"];
  const name = typeof displayName === "string" ? displayName : user?.email?.split("@")[0] ?? "Account";
  const initial = name.slice(0, 1).toUpperCase();

  return <div className="flex min-h-dvh flex-col">
    <a href="#page-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-card focus:p-3 focus:text-primary">Skip to content</a>
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Brand />
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {destinations.map(({ to, label }) => <Button key={to} asChild variant="ghost" className="text-muted-foreground hover:bg-muted hover:text-foreground"><Link to={to} activeProps={{ className: "bg-primary-soft text-primary" }}>{label}</Link></Button>)}
        </nav>
        <div className="flex items-center gap-2">
          {!loading && user && <>
            <Button asChild variant="ghost" size="icon" aria-label="Notifications" title="Notifications"><Link to="/notifications"><Bell /></Link></Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" aria-label="Account menu" className="gap-1.5 hover:bg-muted hover:text-foreground"><span className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-primary">{initial}</span><ChevronDown className="size-3" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel><DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/dashboard"><LayoutDashboard />Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile/edit"><UserRound />Edit Profile</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void signOut()}><LogOut />Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>}
          {!loading && !user && <div className="hidden items-center gap-2 md:flex"><Button asChild variant="ghost" className="hover:bg-muted hover:text-foreground"><Link to="/login">Log In</Link></Button><Button asChild><Link to="/signup">Sign Up<ArrowUpRight /></Link></Button></div>}
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu"><Menu /></Button></SheetTrigger>
            <SheetContent className="w-[min(340px,90vw)] overflow-y-auto">
              <SheetTitle className="text-left">TeamFit</SheetTitle><SheetDescription className="sr-only">Main navigation and account links</SheetDescription>
              <nav aria-label="Mobile navigation" className="mt-8 flex flex-col gap-2">
                {destinations.map(({ to, label }) => <Button key={to} asChild variant="ghost" className="justify-start hover:bg-muted hover:text-foreground"><Link to={to} onClick={() => setDrawerOpen(false)}>{label}</Link></Button>)}
                <div className="my-3 border-t" />
                {user ? <><Button asChild variant="ghost" className="justify-start"><Link to="/dashboard" onClick={() => setDrawerOpen(false)}><LayoutDashboard />Dashboard</Link></Button><Button asChild variant="ghost" className="justify-start"><Link to="/profile/edit" onClick={() => setDrawerOpen(false)}><UserRound />Edit Profile</Link></Button><Button variant="ghost" className="justify-start" onClick={() => { setDrawerOpen(false); void signOut(); }}><LogOut />Log Out</Button></> : <><Button asChild variant="outline"><Link to="/login" onClick={() => setDrawerOpen(false)}>Log In</Link></Button><Button asChild><Link to="/signup" onClick={() => setDrawerOpen(false)}>Sign Up</Link></Button><Button variant="ghost" className="justify-start" onClick={() => { setDrawerOpen(false); requireAuth("notifications"); }}><Bell />Notifications</Button></>}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    <div id="page-content" tabIndex={-1} className="flex-1 outline-none">{children}</div>
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div><Brand /><p className="mt-3 text-sm text-muted-foreground">Good teams start with complementary skills.</p></div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-7 gap-y-4 text-sm font-medium">
          <Link to="/explore" className="hover:text-primary">Explore</Link><Link to="/about" className="hover:text-primary">About</Link><Link to="/privacy" className="hover:text-primary">Privacy</Link><Link to="/finder-card" className="hover:text-primary">Finder Card<Plus className="ml-1 inline size-3" /></Link>
        </nav>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 border-t px-5 py-5 text-xs text-muted-foreground sm:px-8"><span>© {new Date().getUTCFullYear()} TeamFit</span><span>For the next thing you build together.</span></div>
    </footer>
  </div>;
}