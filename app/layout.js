import './globals.css';

export const metadata = {
  title: 'My Blog App',
  description: 'A simple blog built with Next.js and MySQL',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container">
            <h1 className="logo">My Blog</h1>
            <nav className="nav">
              <a href="/">Home</a>
              <a href="/posts">All Posts</a>
              <a href="/posts/create">Create Post</a>
            </nav>
          </div>
        </header>
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