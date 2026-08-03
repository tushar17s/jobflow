// =========================
// CONFIG
// =========================

const API = "http://127.0.0.1:8000";

const jobsContainer = document.getElementById("jobs-container");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const refreshBtn = document.getElementById("refresh");
const clearBtn = document.getElementById("clear");

let allJobs = [];

// =========================
// EVENTS
// =========================

window.onload = loadJobs;

searchInput.oninput = updateView;

sortSelect.onchange = updateView;

refreshBtn.onclick = loadJobs;

clearBtn.onclick = () => {

    searchInput.value = "";

    sortSelect.value = "newest";

    updateView();

};

// =========================
// LOAD JOBS
// =========================

async function loadJobs(){

    refreshBtn.disabled = true;

    refreshBtn.textContent = "Refreshing...";

    try{

        const res = await fetch(`${API}/all`);

        allJobs = await res.json();

        updateView();

    }

    catch(err){

        console.error(err);

        jobsContainer.innerHTML =

        "<h2>Unable to connect.</h2>";

    }

    refreshBtn.disabled = false;

    refreshBtn.textContent = "Refresh";

}

// =========================
// SEARCH + SORT
// =========================

function updateView() {

    let jobs = [...allJobs];

    const query = searchInput.value.trim().toLowerCase();

    if (query) {

        jobs = jobs.filter(job =>

            Object.values(job)
                .join(" ")
                .toLowerCase()
                .includes(query)

        );

    }

    const sortBy = {

        newest: (a, b) =>
            new Date(b.applied_at) - new Date(a.applied_at),

        oldest: (a, b) =>
            new Date(a.applied_at) - new Date(b.applied_at),

        company: (a, b) =>
            a.company.localeCompare(b.company),

        role: (a, b) =>
            a.role.localeCompare(b.role),

        status: (a, b) =>
            a.status.localeCompare(b.status)

    };

    jobs.sort(sortBy[sortSelect.value]);

    renderJobs(jobs);

}

// =========================
// RENDER JOBS
// =========================

function renderJobs(jobs) {

    if (!jobs.length) {

        jobsContainer.innerHTML = `
            <div class="empty-state">
                <h2>No Jobs Found</h2>
            </div>
        `;

        updateStats([]);

        return;
    }

    updateStats(jobs);

    jobsContainer.innerHTML = jobs.map(job => `

    <div class="job-card">

        <div class="job-row">

            <div class="job-main">

                <button class="toggle-btn">

                    ▶

                </button>

                <div>

                    <h3>${job.role}</h3>

                    <div class="job-subtitle">

                        ${job.company} • ${job.location || "Remote"}

                    </div>

                </div>

            </div>

            <div class="platform">

                ${job.platform}

            </div>

            <div class="job-date">

                ${new Date(job.applied_at)
                    .toLocaleDateString("en-IN",{
                        day:"numeric",
                        month:"short",
                        year:"numeric"
                    })}

            </div>

            <div>

                <select
                    class="status"
                    data-id="${job.id}"
                >

                    <option ${job.status=="Saved"?"selected":""}>Saved</option>

                    <option ${job.status=="Applied"?"selected":""}>Applied</option>

                    <option ${job.status=="Interview"?"selected":""}>Interview</option>

                    <option ${job.status=="Rejected"?"selected":""}>Rejected</option>

                    <option ${job.status=="Offer"?"selected":""}>Offer</option>

                </select>

            </div>

            <div class="actions">

                <a
                    href="${job.url}"
                    target="_blank"
                >

                    👁

                </a>

                <button
                    class="delete-btn"
                    data-id="${job.id}"
                >

                    🗑

                </button>

            </div>

        </div>

        <div class="description">

            ${(job.requirements || "No Description")
                .replace(/\n/g,"<br>")}

        </div>

    </div>

    `).join("");
                // =========================
// EVENTS INSIDE JOB LIST
// =========================
            }
jobsContainer.addEventListener("click", async e => {

    // Toggle Description
    if (e.target.classList.contains("toggle-btn")) {

        const card = e.target.closest(".job-card");

        const desc = card.querySelector(".description");

        desc.classList.toggle("show");

        e.target.textContent =
            desc.classList.contains("show")
            ? "▼"
            : "▶";
    }

    // Delete Job
    if (e.target.classList.contains("delete-btn")) {

        const id = e.target.dataset.id;

        if (!confirm("Delete this job?")) return;

        await deleteJob(id);

    }

});

jobsContainer.addEventListener("change", e => {

    if (e.target.classList.contains("status")) {

        updateStatus(

            e.target.dataset.id,

            e.target.value

        );

    }

});
    




async function deleteJob(id){

    try{

        await fetch(

            `${API}/delete/${id}`,

            {

                method:"DELETE"

            }

        );

        allJobs = allJobs.filter(

            j=>j.id!=id

        );

        updateView();

        toast("Job deleted");

    }

    catch(err){

        console.error(err);

    }

}

async function updateStatus(id,status){

    try{

        await fetch(

            `${API}/update/${id}`,

            {

                method:"PATCH",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    status

                })

            }

        );

        allJobs.find(

            j=>j.id==id

        ).status=status;

        updateStats(allJobs);

        toast("Status updated");

    }

    catch(err){

        console.error(err);

    }

}

function updateStats(jobs){

    const count=status=>

        jobs.filter(

            j=>j.status===status

        ).length;

    totalJobs.textContent=jobs.length;

    savedJobs.textContent=count("Saved");

    appliedJobs.textContent=count("Applied");

    interviewJobs.textContent=count("Interview");

    rejectedJobs.textContent=count("Rejected");

}

function toast(msg){

    const div=document.createElement("div");

    div.className="toast";

    div.textContent=msg;

    document.body.append(div);

    setTimeout(

        ()=>div.classList.add("show"),

        20

    );

    setTimeout(

        ()=>div.remove(),

        2200

    );

}

