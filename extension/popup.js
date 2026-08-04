
import {
    extractNaukri,
    extractIndeed,
    extractGeneric
} from "./extractors/extractor.js";


const saveBtn = document.getElementById("saveBtn");

const applyBtn = document.getElementById("applyBtn");
const extractorSelect = document.getElementById("extractor");
const status = document.getElementById("status");

saveBtn.addEventListener("click", () => {

    saveCurrentJob("Saved");

});

applyBtn.addEventListener("click", () => {

    saveCurrentJob("Applied");

});

async function saveCurrentJob(status) {

    try {

        saveBtn.disabled = true;
        saveBtn.textContent = "Extracting...";

        const extractor = extractorSelect.value;

        let extractorFunction;

        switch (extractor) {

            case "naukri":
                extractorFunction = extractNaukri;
                break;

            case "indeed":
                extractorFunction = extractIndeed;
                break;

            default:
                extractorFunction = extractGeneric;

        }

        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        const result =
    await chrome.scripting.executeScript({

        target: {
            tabId: tab.id
        },

        func: extractorFunction

    });

console.log(result);

const job = result[0].result;
job.status = status;
console.log(job);

        if (!job) {

            showStatus(
                "Extraction Failed",
                "#f59e0b"
            );

            return;

        }

        const clickedButton =

    status === "Saved"

    ? saveBtn

    : applyBtn;

clickedButton.disabled = true;

clickedButton.textContent = "Saving...";

        const response = await fetch(
            "http://127.0.0.1:8000/jobs",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(job)

            }

        );

        const data = await response.json();

        if (data.success) {

            showStatus(
                data.message,
                "#22c55e"
            );

        } else {

            showStatus(
                data.message,
                "#f59e0b"
            );

        }

    }

    catch (error) {

        console.error(error);

        showStatus(
            "Connection Failed",
            "#ef4444"
        );

    }

    finally {

        saveBtn.disabled = false;
applyBtn.disabled = false;

saveBtn.textContent = "💾 Save";
applyBtn.textContent = "✅ Apply";

    }

}

function showStatus(message, color) {

    status.textContent = message;

    status.style.color = color;

    setTimeout(() => {

        status.textContent = "Ready";

        status.style.color = "#22c55e";

    }, 2500);

}