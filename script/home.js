const issueContainer = document.getElementById("issue-container");
const issueCount = document.getElementById("issue-count");

const allBtn = document.getElementById("all-btn");
const openBtn = document.getElementById("open-btn");
const closedBtn = document.getElementById("closed-btn");

const modal = document.getElementById("issue-modal");
const modalSpinner = document.getElementById("modal-spinner");
const modalContent = document.getElementById("modal-content");
const closeModalBtn = document.getElementById("close-modal");
const searchInput = document.getElementById("search-input");
let allIssues = [];

const showSpinner = () => {
  issueContainer.innerHTML = `
    <div class="col-span-full flex justify-center py-20">
      <span class="loading loading-spinner loading-lg text-violet-600"></span>
    </div>
  `;
};


searchInput.addEventListener("input", async (e) => {
  const searchText = e.target.value.trim();

  if (searchText === "") {
    displayIssues(allIssues);
    return;
  }

  showSpinner();

  try {
    const response = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(searchText)}`
    );

    const result = await response.json();

    displayIssues(result.data);
  } catch (error) {
    console.log(error);

    issueContainer.innerHTML = `
      <div class="col-span-full py-20 text-center text-red-500">
        Failed to search issues.
      </div>
    `;
  }
});
const createIssueCard = (issue) => {
  return `
    <div
      onclick="openIssueModal(${issue.id})"
      class="cursor-pointer overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >

      <div
        class="border-t-2 ${
          issue.status === "open"
            ? "border-emerald-500"
            : "border-violet-500"
        } p-3"
      >

        <div class="mb-2 flex items-center justify-between">

          <div
            class="flex h-7 w-7 items-center justify-center rounded-full ${
              issue.status === "open"
                ? "bg-emerald-100"
                : "bg-violet-100"
            }"
          >
            <i
              class="fa-solid fa-circle-check ${
                issue.status === "open"
                  ? "text-emerald-500"
                  : "text-violet-500"
              }"
            ></i>
          </div>

          <span
            class="rounded-full px-3 py-1 text-xs font-semibold uppercase ${
              issue.priority === "high"
                ? "bg-red-100 text-red-500"
                : issue.priority === "medium"
                ? "bg-yellow-100 text-yellow-500"
                : "bg-slate-100 text-slate-500"
            }"
          >
            ${issue.priority}
          </span>

        </div>

        <h3 class="text-sm font-bold text-slate-800">
          ${issue.title}
        </h3>

        <p class="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
          ${issue.description}
        </p>

        <div class="mt-3 flex flex-wrap gap-1">

          ${issue.labels
            .map(
              (label) => `
                <span
                  class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase text-slate-500"
                >
                  ${label}
                </span>
              `
            )
            .join("")}

        </div>

      </div>

      <div class="border-t border-slate-200 px-3 py-2 text-[10px] text-slate-500">

        <p>
          #${issue.id} by ${issue.author}
        </p>

        <p class="mt-1">
          ${new Date(issue.createdAt).toLocaleDateString()}
        </p>

      </div>

    </div>
  `;
};

const displayIssues = (issues) => {
  showSpinner();

  setTimeout(() => {
    issueCount.innerText = `${issues.length} Issues`;

    issueContainer.innerHTML = issues
      .map((issue) => createIssueCard(issue))
      .join("");
  }, 300);
};

const setActiveButton = (activeButton) => {
  [allBtn, openBtn, closedBtn].forEach((button) => {
    button.classList.remove("bg-violet-600", "text-white");
    button.classList.add("bg-white", "text-slate-600");
  });

  activeButton.classList.remove("bg-white", "text-slate-600");
  activeButton.classList.add("bg-violet-600", "text-white");
};

const loadIssues = async () => {
  showSpinner();

  try {
    const response = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues"
    );

    const result = await response.json();

    allIssues = result.data;

    await displayIssues(allIssues);

    setActiveButton(allBtn);
  } catch (error) {
    console.log(error);

    issueContainer.innerHTML = `
      <div class="col-span-full py-20 text-center text-red-500">
        Failed to load issues.
      </div>
    `;
  }
};

allBtn.addEventListener("click", async () => {
  setActiveButton(allBtn);

  await displayIssues(allIssues);
});

openBtn.addEventListener("click", async () => {
  setActiveButton(openBtn);

  const openIssues = allIssues.filter(
    (issue) => issue.status === "open"
  );

  await displayIssues(openIssues);
});

closedBtn.addEventListener("click", async () => {
  setActiveButton(closedBtn);

  const closedIssues = allIssues.filter(
    (issue) => issue.status === "closed"
  );

  await displayIssues(closedIssues);
});

const openIssueModal = async (id) => {
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  modalSpinner.classList.remove("hidden");
  modalContent.classList.add("hidden");

  try {
    const response = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
    );

    const result = await response.json();

    const issue = result.data;

    document.getElementById("modal-title").innerText =
      issue.title;

    document.getElementById("modal-description").innerText =
      issue.description;

    document.getElementById("modal-author").innerText =
      issue.author;

    document.getElementById("modal-date").innerText =
      new Date(issue.createdAt).toLocaleDateString();

    document.getElementById("modal-assignee").innerText =
      issue.assignee || "Unassigned";

    const status = document.getElementById("modal-status");

    status.innerText =
      issue.status === "open" ? "Opened" : "Closed";

    status.className =
      issue.status === "open"
        ? "rounded-full bg-emerald-500 px-3 py-1 font-medium text-white"
        : "rounded-full bg-violet-500 px-3 py-1 font-medium text-white";

    const priority = document.getElementById("modal-priority");

    priority.innerText = issue.priority;

    priority.className =
      issue.priority === "high"
        ? "mt-1 inline-block rounded-full bg-red-500 px-3 py-1 text-xs font-semibold uppercase text-white"
        : issue.priority === "medium"
        ? "mt-1 inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold uppercase text-white"
        : "mt-1 inline-block rounded-full bg-slate-400 px-3 py-1 text-xs font-semibold uppercase text-white";

    const labels = document.getElementById("modal-labels");

    labels.innerHTML = issue.labels
      .map(
        (label) => `
          <span
            class="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase text-red-500"
          >
            ${label}
          </span>
        `
      )
      .join("");

    modalSpinner.classList.add("hidden");
    modalContent.classList.remove("hidden");
  } catch (error) {
    console.log(error);

    modalSpinner.innerHTML = `
      <p class="text-red-500">
        Failed to load issue details.
      </p>
    `;
  }
};

const closeModal = () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
};

closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

loadIssues();