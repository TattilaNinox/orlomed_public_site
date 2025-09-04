"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Doc = { id: string; title: string; category: string };

export default function Home() {
  const [grouped, setGrouped] = useState<Record<string, Doc[]>>({});

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'public_documents'));
      const g: Record<string, Doc[]> = {};
      snap.forEach(d => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = d.data() as any;
        const cat = data.category ?? 'Egyéb';
        (g[cat] ??= []).push({ id: d.id, title: data.title ?? 'Cím nélkül', category: cat });
      });
      setGrouped(g);
    })();
  }, []);

  return (
    <main className="p-8 space-y-6 max-w-3xl mx-auto">
      {Object.keys(grouped).length === 0 && (
        <p className="text-gray-500">Nincs megjeleníthető tartalom.</p>
      )}
      {Object.entries(grouped).map(([cat, list]) => (
        <details key={cat} className="border rounded">
          <summary className="p-3 font-bold cursor-pointer select-none">{cat}</summary>
          <ul className="pl-6 py-2 list-disc">
            {list.map(doc => (
              <li key={doc.id}>
                <Link href={`/doc/${doc.id}`} className="text-blue-600 hover:underline">
                  {doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </main>
  );
}
