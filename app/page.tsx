import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Doc = { id: string; title: string; category: string };

async function getDocuments(): Promise<Record<string, Doc[]>> {
  const snap = await getDocs(collection(db, 'public_documents'));
  const grouped: Record<string, Doc[]> = {};
  
  snap.forEach(d => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = d.data() as any;
    const cat = data.category ?? 'Egyéb';
    (grouped[cat] ??= []).push({ 
      id: d.id, 
      title: data.title ?? 'Cím nélkül', 
      category: cat 
    });
  });
  
  return grouped;
}

export default async function Home() {
  const grouped = await getDocuments();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Lomedu Dokumentumok</h1>
          <p className="text-lg text-gray-600">Adatvédelmi irányelvek és felhasználási feltételek</p>
        </header>
        
        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nincs megjeleníthető tartalom.</p>
          </div>
        )}
        
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, list]) => (
            <div key={cat} className="bg-white rounded-lg shadow-md overflow-hidden">
              <details className="group">
                <summary className="p-6 font-semibold text-xl cursor-pointer select-none bg-gray-50 hover:bg-gray-100 transition-colors border-b group-open:border-b-0">
                  <span className="flex items-center justify-between">
                    {cat}
                    <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-6">
                  <ul className="space-y-3">
                    {list.map(doc => (
                      <li key={doc.id}>
                        <Link 
                          href={`/doc/${doc.id}`} 
                          className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-blue-700 hover:text-blue-800"
                        >
                          <span className="font-medium">{doc.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
