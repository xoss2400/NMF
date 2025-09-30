
import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Providers from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
  <Navbar />
  <Providers>{children}</Providers>
      </body>
    </html>
  )
}
