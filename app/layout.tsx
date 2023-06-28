import "./globals.css";

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
          {children}
      </body>
      <script>
      </script>
    </html>
  )
}

export default RootLayout;
