async function handleFileUpload(event) {

    const uploadedFile = event.target.files[0];

    if (!uploadedFile) return;

    const formData = new FormData();

    formData.append("file", uploadedFile);

    try {

        document.getElementById("status").innerText =
            "Processing file...";

        const response = await fetch(
            "https://back-end-cbse-class12-result-analyser-1.onrender.com/predict",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        console.log(result);

        if (result.error) {
            throw new Error(result.error);
        }

        document.getElementById("status").innerText =
            "File processed successfully";

        console.log("Subjects:", result.subjects);

        // YOUR RESULT DISPLAY LOGIC HERE
        // Example:
        displayResults(result);

    } catch (error) {

        console.error(error);

        document.getElementById("status").innerText =
            "Error in processing file ❌";
    }
}
