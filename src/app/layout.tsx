import './globals.css';

export const metadata = {
  title: 'FACIS Issuer Platform — Reference Demo',
  description: 'Interactive reference architecture for Go, gRPC, NATS and OID4VCI credential issuance.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
