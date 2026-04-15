import './globals.css';

export const metadata = {
  title: 'The Clarity Coach Vault',
  description: 'Hire an experienced Clarity Coach to close your Enagic sales calls.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
