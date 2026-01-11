import { getById } from "./db_request.js";
import supabase from "../config/supabaseClient.js";
import { uploadSingleFile, isDocumentIndexed } from "../documents/documents.js";

const getFilesFromDB = async (ids) => {
  const files = await Promise.all(ids.map((id) => getById("documents", id)));

  return files;
};

const getFileBlobs = async (files) => {
  // 1. Use Promise.all to wait for all async downloads in the map
  const fileDataArray = await Promise.all(
    files.map(async (file) => {
      const { data, error } = await supabase.storage
        .from("documents")
        .download(file.storage_path);

      if (error) {
        console.error(`Error downloading ${file.storage_path}:`, error);
        return null;
      }

      // 2. data is a Blob. To treat it like a File (useful for Backboard/FormData):
      return new File([data], file.name || "document.pdf", {
        type: data.type || "application/pdf",
      });
    })
  );

  // 3. Return the array of File objects, filtering out any failures
  return fileDataArray.filter((f) => f !== null);
};

export default async (ids) => {
  const files = await getFilesFromDB(ids);
  const blobs = await getFileBlobs(files);

  const user = files[0].user_id;

  console.log("USER: ", user);

  const backboardURL = `https://app.backboard.io/api`;

  // ASSISTANT
  const assistantSearch = await supabase
    .from("assistants")
    .select("*")
    .eq("user_id", user)
    .maybeSingle();

  const assistantId = assistantSearch.data.id;

  const response = await fetch(`${backboardURL}/assistants`, {
    headers: {
      "X-API-KEY": `${process.env.BACKBOARD_KEY}`,
    },
  });

  const assistants = await response.json();

  console.log("We currently have this many assistants: ", assistants.length);

  // THREAD CREATION
  const thread_res = await fetch(
    `${backboardURL}/assistants/${assistantId}/threads`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": `${process.env.BACKBOARD_KEY}`,
      },
      body: JSON.stringify({}),
    }
  );

  const threadObject = await thread_res.json();
  const thread = threadObject.thread_id;

  console.log("THREAD ID: ", thread);

  // DOCUMENTS
  // 3. UPLOAD PHASE (The Fix)
  console.log("🚀 Starting Uploads...");
  const uploadPromises = blobs.map((blob, index) =>
    uploadSingleFile(blob, files[index], thread, backboardURL)
  );

  // Wait for ALL uploads to finish
  const uploadedDocIds = (await Promise.all(uploadPromises)).filter(
    (id) => id !== null
  );

  console.log("IDS UPLOADED: ", uploadedDocIds);

  if (uploadedDocIds.length === 0) {
    throw new Error("No files were uploaded successfully.");
  }

  // 4. INDEXING PHASE (The Fix)
  console.log("⏳ Waiting for Backboard to index files...");
  await Promise.all(
    uploadedDocIds.map((docId) => isDocumentIndexed(docId, backboardURL))
  );

  console.log("✅ All files ready. Deleting thread...");

  // 5. CLEANUP
  // Now it is safe to delete the thread or generate questions
  await fetch(`${backboardURL}/threads/${thread}`, {
    method: "DELETE",
    headers: { "X-API-Key": process.env.BACKBOARD_KEY },
  });

  return uploadedDocIds;
};
