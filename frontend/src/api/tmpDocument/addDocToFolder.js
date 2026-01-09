// sample data:
// { id: 'doc-1', name: 'Integration Techniques.pdf', type: 'pdf', folderId: 'folder-1', size: '2.4 MB', uploadedAt: new Date('2024-01-15') },

import { mockDocuments } from "@/lib/mockData";

export function addDocToDB(document) {
  const fullName = document.split(".");

  mockDocuments.push({
    id: crypto.randomUUID(),
    name: fullName[0],
    type: "pdf",
    folderId: "folder-1",
    size: "1.3MB",
    uploadedAt: new Date(),
  });
}
