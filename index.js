const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const outputDiv = document.getElementById("output");

uploadBtn.addEventListener("click", async () => {

    const file = fileInput.files[0];

    if (!file) {
        alert("Please select TXT file");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    outputDiv.innerHTML = "Processing file...";

    try {

        const response = await fetch(
            "https://back-end-cbse-class12-result-analyser-1.onrender.com/predict",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        console.log(data);

        if (data.success !== true) {
            outputDiv.innerHTML =
                "Backend Error ❌<br><br>" +
                JSON.stringify(data);
            return;
        }

        if (!data.subjects) {
            outputDiv.innerHTML =
                "No subjects returned from backend";
            return;
        }

        let html = `
            <h2>Subject Wise PI Report</h2>
            <table border="1" cellpadding="5">
                <tr>
                    <th>Code</th>
                    <th>Subject</th>
                    <th>Total</th>
                    <th>Pass %</th>
                    <th>PI</th>
                </tr>
        `;

        for (let i = 0; i < data.subjects.length; i++) {

            const s = data.subjects[i];

            html += `
                <tr>
                    <td>${s.code}</td>
                    <td>${s.name}</td>
                    <td>${s.totalPresent}</td>
                    <td>${s.passPercentage}</td>
                    <td>${s.pi}</td>
                </tr>
            `;
        }

        html += `
            </table>
            <br>
            <h3>Overall PI : ${data.overallPI}</h3>
        `;

        outputDiv.innerHTML = html;

    }
    catch (err) {

        console.log(err);

        outputDiv.innerHTML =
            "Error connecting to backend API ❌<br><br>" +
            err;
    }
});
