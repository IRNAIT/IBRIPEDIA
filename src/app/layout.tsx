import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { Navigation } from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'IBRIPEDIA - Энциклопедия ролевых игр',
  description: 'Сообщество игроков для различных ролевых игр',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  )
}
