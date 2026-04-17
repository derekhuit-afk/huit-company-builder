import { redirect } from 'next/navigation'
export const metadata = { title: 'Privacy Policy — Huit.AI Company Builder' }
export default function PrivacyRedirect() { redirect('/terms?tab=privacy') }
