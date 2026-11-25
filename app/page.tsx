import { Landing } from "@/components/landing/landing"
import { currentPrice } from "@/lib/product"

// Re-render every 5 minutes so the launch price ends on time even though the
// page is otherwise static.
export const revalidate = 300

export default function Page() {
  return <Landing price={currentPrice()} />
}
