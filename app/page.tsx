import { Landing } from "@/components/landing/landing"
import { currentPrice } from "@/lib/product"
import { homeSchema } from "@/lib/schema"

// Re-render every 5 minutes so the launch price ends on time even though the
// page is otherwise static.
export const revalidate = 300

export default function Page() {
  const price = currentPrice()
  return (
    <>
      <script
        type="application/ld+json"
        // "<" escaped so a string in the data can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema(price)).replace(/</g, "\\u003c") }}
      />
      <Landing price={price} />
    </>
  )
}
