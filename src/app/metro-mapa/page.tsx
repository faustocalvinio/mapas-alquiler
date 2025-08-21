"use client";
import dynamic from 'next/dynamic';

const MetroMap = dynamic(() => import('./components/MetroMap'), { ssr: false });

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MetroMap />
    </div>
  );
}
