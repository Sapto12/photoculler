import {Plus_Jakarta_Sans} from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: "--font-jakarta" });

export const metadata = {
  title: ' Pensortir foto otomatis',
  description: 'pensortir foto lokal otomatis dengan AI',

};

export default function RootLayout({ children}){
  return (
    <html lang="id">
      <body className={`${jakarta.className} bg-slate-950 text-slate-50 antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}