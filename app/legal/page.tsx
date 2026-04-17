import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const metadata = { title: 'Legal — Huit.AI Company Builder' }
export default function LegalRedirect() { redirect('/terms') }
