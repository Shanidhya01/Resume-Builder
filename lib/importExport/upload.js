// XMLHttpRequest-based upload with progress callbacks — fetch() still has no
// upload-progress API, and the dropzone shows a real progress bar.

export function uploadFileWithProgress(url, file, { onProgress } = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);

        xhr.upload.addEventListener('progress', event => {
            if (event.lengthComputable && onProgress) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        });

        xhr.addEventListener('load', () => {
            let data = null;
            try {
                data = JSON.parse(xhr.responseText);
            } catch (err) {
                // non-JSON response body — fall through to the status check
            }
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(data);
            } else {
                reject(new Error(data?.error || `Upload failed (${xhr.status}).`));
            }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error during upload.')));
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled.')));

        xhr.open('POST', url);
        xhr.send(formData);
    });
}
