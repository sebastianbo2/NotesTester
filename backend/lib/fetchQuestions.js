import { getById } from "./db_request.js";
import { supabase } from "./supabase.js";

export default async (ids) => {
    const getFilesFromDB = async (ids) => {
        const files = await Promise.all(
          ids.map(id => getById('documents', id))
        )
    
        return files
    }
    
    const getFileBlobs = async (files) => {
        // 1. Use Promise.all to wait for all async downloads in the map
        const fileDataArray = await Promise.all(
        files.map(async (file) => {
        const { data, error } = await supabase.storage
            .from('documents')
            .download(file.storage_path);

        if (error) {
            console.error(`Error downloading ${file.storage_path}:`, error);
            return null;
        }

        // 2. data is a Blob. To treat it like a File (useful for Backboard/FormData):
        return new File([data], file.name || 'document.pdf', {
            type: data.type || 'application/pdf',
        });
        })
        );

        // 3. Return the array of File objects, filtering out any failures
        return fileDataArray.filter(f => f !== null);
    };
    
    const files = await getFilesFromDB(ids)
    const blobs = await getFileBlobs(files)

    const user = files[0].user_id

    console.log("USER: ", user)

    const frontLink = `https://app.backboard.io/api`

    const assistant_search = await supabase
    .from('assistants')
    .select('*')
    .eq('user_id', user)
    .maybeSingle()

    const assistant = assistant_search.data.id

    const response = await fetch(`${frontLink}/assistants`, {
        headers: {
            'X-API-KEY': `${process.env.BACKBOARD_KEY}`
        }
    })

    const assistants = await response.json()

    console.log("We currently hae this many assistants: ", assistants.length)

    const thread_res = await fetch(`${frontLink}/assistants/${assistant}/threads`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': `${process.env.BACKBOARD_KEY}`,
    },
    body: JSON.stringify({})
    })

    const threadObject = await thread_res.json()
    const thread = threadObject.thread_id

    console.log("THREAD ID: ", thread)
    
    let processedDocuments = []

    blobs.forEach(async (blob, index) => {
        if (!blob) {
            return
        }

        const formData = new FormData();

        console.log(blob)

        formData.append('file', blob, files[index].id)

        const response = await fetch(`${frontLink}/threads/${thread}/documents`, {
            method: 'POST',
            headers: {
                'X-API-Key': `${process.env.BACKBOARD_KEY}`
            },
            body: formData
        })

        const json = await response.json()

        console.log("RESPONSE: ", json);
        console.log("id: ", json.document_id)

        processedDocuments.push(json.document_id)

        const res = await fetch (`${frontLink}/documents/${json.document_id}/status`, {
            headers: {
                'X-API-Key': `${process.env.BACKBOARD_KEY}`
            }
        })

        const json2 = await res.json()

        console.log("STATUS: ", json2)
    })

    const doc_check_res = await fetch(`${frontLink}/threads/${thread}/documents`, {
        headers: {
            'X-API-KEY': `${process.env.BACKBOARD_KEY}`
        }
    })

    const doc_json = await doc_check_res.json()

    console.log("DOCS: ", doc_json)

    console.log("ASSISTANT: ", assistant)

    console.log("IDS: ", processedDocuments)

    // processedDocuments.forEach(async doc => {
    //     const response = await fetch (`${frontLink}/documents/${doc}/status`, {
    //         headers: {
    //             'X-API-Key': `${process.env.BACKBOARD_KEY}`
    //         }
    //     })

    //     const json = await response.json()

    //     console.log("STATUS: ", json)
    // })

    const thread_delete_res = await fetch(`${frontLink}/threads/${thread}`, {
        method: 'DELETE',
        headers: {
            'X-API-Key': `${process.env.BACKBOARD_KEY}`
        }
    })

    const thread_deleted = await thread_delete_res.json()

    console.log("DELETION STATUS: ", thread_deleted)

    return []
}