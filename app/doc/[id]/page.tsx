import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface DocPageProps {
  params: { id: string };
}

async function getDocument(id: string) {
  const snap = await getDoc(doc(db, 'public_documents', id));
  
  if (!snap.exists()) {
    return null;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = snap.data() as any;
  return {
    title: data.title ?? 'Cím nélkül',
    content: data.content ?? '',
    category: data.category ?? 'Egyéb'
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { id } = await params;
  const document = await getDocument(id);
  
  if (!document) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">{document.title}</h1>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              {document.category}
            </span>
          </header>
          <article className="p-8 prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800">
            <div dangerouslySetInnerHTML={{ __html: document.content }} />
          </article>
        </div>
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Vissza a dokumentumokhoz
          </Link>
        </div>
      </div>
    </div>
  );
}
