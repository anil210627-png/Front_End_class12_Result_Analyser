const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const outputDiv = document.getElementById("output");

uploadBtn.addEventListener("click", async () => {

    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a TXT file");
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

        // Show full backend response on screen
        outputDiv.innerHTML = `
            <pre>${JSON.stringify(data, null, 2)}</pre>
        `;

        // Stop if backend failed
        if (!data.success) {
            outputDiv.innerHTML += `
                <br><br>
                <div style="color:red;font-weight:bold;">
                    Backend Processing Failed ❌
                </div>
            `;
            return;
        }

        // Check subjects
        if (!data.subjects || !Array.isArray(data.subjects)) {

            outputDiv.innerHTML += `
                <br><br>
                <div style="color:red;font-weight:bold;">
                    Subjects data missing ❌
                </div>
            `;

            return;
        }

        // Build HTML table
        let html = `
            <h2>CBSE Subject Wise PI Report</h2>

            <table border="1" cellpadding="8" cellspacing="0">

                <tr>
                    <th>Code</th>
                    <th>Subject</th>
                    <th>Total</th>
                    <th>A1</th>
                    <th>A2</th>
                    <th>B1</th>
                    <th>B2</th>
                    <th>C1</th>
                    <th>C2</th>
                    <th>D</th>
                    <th>E</th>
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
                    <td>${s.A1}</td>
                    <td>${s.A2}</td>
                    <td>${s.B1}</td>
                    <td>${s.B2}</td>
                    <td>${s.C1}</td>
                    <td>${s.C2}</td>
                    <td>${s.D}</td>
                    <td>${s.E}</td>
                    <td>${s.passPercentage}</td>
                    <td>${s.pi}</td>
                </tr>
            `;
        }

        html += `
            </table>

            <br>

            <h3>Overall School PI : ${data.overallPI}</h3>
        `;

        outputDiv.innerHTML = html;

    }
    catch (err) {

        console.log(err);

        outputDiv.innerHTML = `
            <div style="color:red;font-weight:bold;">
                Error connecting to backend API ❌
                <br><br>
                ${err}
            </div>
        `;
    }
});
