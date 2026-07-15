export async function uploadToR2(file: File) {
    // get presigned URL from Express backend
    const { signedUrl, publicUrl } = await fetch("/api/upload/get-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
    }).then(r => r.json());

    // upload directly to R2(Express never sees the file)
    await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
    });

    return publicUrl;
}
