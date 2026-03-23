import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <h1>404 - Page Not Found</h1>
      <Link href="/">Back to Home</Link>
    </div>
  );
}
