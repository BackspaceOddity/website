import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function PlaygroundPage() {
  return (
    <div style={{ padding: "80px", display: "flex", flexDirection: "column", gap: "40px", maxWidth: "800px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px" }}>
        shadcn primitives — BSO token check (BSO-871)
      </h1>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Button variant="default">Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>

      <Input placeholder="Type here — should be GT Eesti Pro Text" />

      <Card>
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description in muted-foreground</CardDescription>
        </CardHeader>
        <CardContent>Card body content, should sit on cream-soft.</CardContent>
      </Card>

      <div style={{ display: "flex", gap: "12px" }}>
        {/* NOTE (BSO-871): DialogTrigger/DropdownMenuTrigger asChild-wrapping a
            <Button> double-renders a nested <button> (Base UI 1.6.0 + this
            Button's ButtonPrimitive don't merge through asChild cleanly).
            Styling the trigger directly via buttonVariants() sidesteps it —
            flagged in the audit as a gap to resolve before Dialog/DropdownMenu
            get used with a custom trigger element in real migration work. */}
        <Dialog>
          <DialogTrigger className={buttonVariants({ variant: "outline" })}>
            Open dialog
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog title</DialogTitle>
              <DialogDescription>Dialog on BSO tokens.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
            Open menu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item one</DropdownMenuItem>
            <DropdownMenuItem>Item two</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
