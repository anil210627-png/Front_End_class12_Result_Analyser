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

        console.log("Backend Response:", data);

        if (!data.success) {
            throw new Error(data.error || "Backend processing failed");
        }

        if (!data.subjects || !Array.isArray(data.subjects)) {
            throw new Error("Subjects data missing from backend");
        }

        let html = "";

        html += `
            <h2>CBSE Subject Wise PI Report</h2>

            <table border="1" cellpadding="8" cellspacing="0">
                <tr>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
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

        data.subjects.forEach((subject) => {

            html += `
                <tr>
                    <td>${subject.code}</td>
                    <td>${subject.name}</td>
                    <td>${subject.totalPresent}</td>
                    <td>${subject.A1}</td>
                    <td>${subject.A2}</td>
                    <td>${subject.B1}</td>
                    <td>${subject.B2}</td>
                    <td>${subject.C1}</td>
                    <td>${subject.C2}</td>
                    <td>${subject.D}</td>
                    <td>${subject.E}</td>
                    <td>${subject.passPercentage}%</td>
                    <td>${subject.pi}</td>
                </tr>
            `;
        });

        html += `
            </table>

            <br>

            <h3>Overall School PI : ${data.overallPI}</h3>
        `;

        outputDiv.innerHTML = html;

    }
    catch (err) {

        console.error(err);

        outputDiv.innerHTML = `
            <div style="color:red;font-weight:bold;">
                Error connecting to backend API ❌
                <br><br>
                ${err}
            </div>
        `;
    }
});
