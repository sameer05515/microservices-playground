import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Directory/Topic Management',
  description: 'Manage hierarchical directory structure with sub-directories and topics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

