export async function uploadRemoteFile(genAI, url, type, displayName) {
  console.log("Uploading file from URL:", url);
  const fileBuffer = await fetch(url).then((response) =>
    response.arrayBuffer()
  );

  const fileBlob = new Blob([fileBuffer], { type: type });

  const file = await genAI.files.upload({
    file: fileBlob,
    config: {
      displayName: displayName,
    },
  });

  // Wait for the file to be processed.
  let getFile = await genAI.files.get({ name: file.name });
  while (getFile.state === "PROCESSING") {
    getFile = await genAI.files.get({ name: file.name });
    console.log(`current file status: ${getFile.state}`);
    console.log("File is still processing, retrying in 5 seconds");

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }
  if (file.state === "FAILED") {
    throw new Error("File processing failed.");
  }

  return file;
}
