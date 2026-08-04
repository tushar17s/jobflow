// =========================
// CONFIG
// =========================

const API = "http://127.0.0.1:8000";

const jobsContainer = document.getElementById("jobs-container");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const refreshBtn = document.getElementById("refresh");
const clearBtn = document.getElementById("clear");

let currentPage = 1;

let totalPages = 1;


// =========================
// EVENTS
// =========================

window.onload = loadJobs;

searchInput.oninput = () => {

    currentPage = 1;

    loadJobs();

};

sortSelect.onchange = () => {

    currentPage = 1;

    loadJobs();

};

clearBtn.onclick = () => {

    searchInput.value = "";

    sortSelect.value = "newest";

    currentPage = 1;

    loadJobs();

};

refreshBtn.onclick = loadJobs;

clearBtn.onclick = () => {

    searchInput.value = "";

    sortSelect.value = "newest";

    loadJobs();

};

// =========================
// LOAD JOBS
// =========================

async function loadJobs(){
    
    refreshBtn.disabled = true;

    refreshBtn.textContent = "Refreshing...";

    try{

        const search = searchInput.value.trim();

        const sort = sortSelect.value;

        const res = await fetch(

        `${API}/all?page=${currentPage}&page_size=10&search=${encodeURIComponent(search)}&sort=${sort}`

        );

        const data = await res.json();

        totalPages = data.total_pages;

        renderJobs(data.jobs);

        updateStats(data);

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
// RENDER JOBS
// =========================
function renderJobs(

    jobs,

    totalJobs

){

    if (!jobs.length) {

        jobsContainer.innerHTML = `
            <div class="empty-state">
                <h2>No Jobs Found</h2>
            </div>
        `;

        updateStats([]);

        return;
    }

    

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

    renderPagination();
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

    const prev = e.target.closest("#prevPage");

if(prev){

    currentPage--;

    loadJobs();

}

const next = e.target.closest("#nextPage");

if(next){

    currentPage++;

    loadJobs();

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
await loadJobs();
    try{

        await fetch(

            `${API}/delete/${id}`,

            {

                method:"DELETE"

            }

        );

        allJobs = allJobs.filter(j => j.id != id);

        updateView();

        toast("Job deleted");

    }

    catch(err){

        console.error(err);

    }

}

async function updateStatus(id,status){
await loadJobs();
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

        await loadJobs();

toast("Status updated");

        toast("Status updated");

    }

    catch(err){

        console.error(err);

    }

}

function updateStats(data){

    

    totalJobs.textContent = data.total;

    savedJobs.textContent = data.stats.saved;

    appliedJobs.textContent = data.stats.applied;

    interviewJobs.textContent = data.stats.interview;

    rejectedJobs.textContent = data.stats.rejected;



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


function renderPagination(){

    if(totalPages<=1)return;

    jobsContainer.innerHTML += `

<div class="pagination">

<button

id="prevPage"

${currentPage===1?"disabled":""}

>

← Previous

</button>

<span>

Page ${currentPage}

of

${totalPages}

</span>

<button

id="nextPage"

${currentPage===totalPages?"disabled":""}

>

Next →

</button>

</div>

`;

}