import type { Metadata } from 'next';
import './global.css';

import { Providers } from './components/providers';

import { Navigation } from './components/navigation';

export const metadata: Metadata = {
  metadataBase: new URL('https://amnaya.info'),
  title: {
    default: 'Amnaya | Ancient Wisdom for Modern Enlightenment',
    template: '%s | Amnaya.info'
  },
  description: 'Amnaya is a sacred sanctuary of Vedic wisdom. Explore AI-curated insights from the 4 Vedas, Bhagavad Gita, and Upanishads, degined to help you relax, learn, and awaken your spiritual journey through modern RAG technology.',
  keywords: ['Amnaya', 'Hindu', 'Sanatana', 'Philosophy', 'Self-Realization', 'Meditation', 'Spirituality', 'Modern Vedic Interpretation', 'RAG AI Spirituality', 'Vedas', 'Bhagavad Gita'],
  authors: [{ name: 'Pratyush Kshatri' }],
  creator: 'Amnaya.info',
  publisher: 'Amnaya.info',
  category: 'Spirituality & Education',
  // Social Media
  openGraph: {
    title: 'Amnaya | Enlighten your Path with Vedic Wisdom',
    description: 'Bridging the gap between ancient Sanskrit texts and modern life through intelligent, AI-driven spiritual guidance.',
    url: 'https://amnaya.info',
    siteName: 'Amnaya',
    // images: [{ url, width, height, alt }]
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amnaya | Ancient Wisdom for Modern Enlightenment',
    description: 'Transformative insights from the 4 Vedas, Bhagavad Gita, Upanishads, interpreted for the digital age.',
    // images: []
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  // verification: { google: '' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className='relative w-full min-h-screen'>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
