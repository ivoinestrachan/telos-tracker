import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Will you answer the call?',
  description: 'Welcome to the Telos House switchboard. Will you make the right choices?',
  openGraph: {
    title: 'Will you answer the call?',
    description: 'Welcome to the Telos House switchboard. Will you make the right choices?',
    images: [
      {
        url: '/images/phone-removebg-preview.png',
        width: 800,
        height: 800,
        alt: 'Telos House Phone',
      }
    ],
    type: 'website',
    siteName: 'Telos House',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Will you answer the call?',
    description: 'Welcome to the Telos House switchboard. Will you make the right choices?',
    images: ['/images/phone-removebg-preview.png'],
  },
};

export default function CallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

