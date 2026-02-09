
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function RootPage() {
  redirect("/login")
  // Ideally this should check for token presence via cookies/middleware
}
