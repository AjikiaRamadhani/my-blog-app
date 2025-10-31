import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata = {
  title: 'My Blog App',
  description: 'A simple blog built with Next.js and MySQL',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="main">
          {children}
        </main>
        <footer className="footer">
          <div className="container">
            <p>&copy; 2024 My Blog App. Built with Next.js & MySQL.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}