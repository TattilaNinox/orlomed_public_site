"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DocPage() {
  const { id } = useParams<{ id: string }>();
  const [html, setHtml] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, 'public_documents', id));
      if (snap.exists()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const d = snap.data() as any;
        setTitle(d.title ?? '');
        setHtml(d.content ?? '');
      }
    })();
  }, [id]);

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">{title}</h1>
      <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
