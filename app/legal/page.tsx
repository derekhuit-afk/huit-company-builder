import { redirect } from 'next/navigation'
export const metadata = { title: 'Legal — Huit.AI Company Builder' }
export default function LegalRedirect() { redirect('/terms') }
