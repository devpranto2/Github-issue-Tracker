const issueContainer = document.getElementById("issue-container");
const issueCount = document.getElementById("issue-count");

const allBtn = document.getElementById("all-btn");
const openBtn = document.getElementById("open-btn");
const closedBtn = document.getElementById("closed-btn");

let allIssues = [];

const createIssueCard = (issue) => {
  return `
    <div class="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">

      <div class="border-t-2 ${
        issue.status === "open"
          ? "border-emerald-500"
          : "border-violet-500"
      } p-3">

        <div class="mb-2 flex items-center justify-between">

          <div class="flex h-7 w-7 items-center justify-center rounded-full ${
            issue.status === "open"
              ? "bg-emerald-100"
              : "bg-violet-100"
          }">
            <i class="fa-solid fa-circle-check ${
              issue.status === "open"
                ? "text-emerald-500"
                : "text-violet-500"
            }"></i>
          </div>

          <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase ${
            issue.priority === "high"
              ? "bg-red-100 text-red-500"
              : issue.priority === "medium"
              ? "bg-yellow-100 text-yellow-500"
              : "bg-slate-100 text-slate-500"
          }">
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
                <span class="rounded-full border border-yellow-200 bg-yellow-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-500">
                  ${label}
                </span>
              `
            )
            .join("")}

        </div>

      </div>

      <div class="border-t border-slate-200 px-3 py-2 text-[10px] text-slate-500">
        <p>#${issue.id} by ${issue.author}</p>

        <p class="mt-1">
          ${new Date(issue.createdAt).toLocaleDateString()}
        </p>
      </div>

    </div>
  `;
};

const displayIssues = (issues) => {
  issueContainer.innerHTML = "";

  issueCount.innerText = `${issues.length} Issues`;

  issues.forEach((issue) => {
    issueContainer.innerHTML += createIssueCard(issue);
  });
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
  try {
    const response = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues"
    );

    const result = await response.json();

    allIssues = result.data;

    displayIssues(allIssues);
  } catch (error) {
    console.log(error);
  }
};

allBtn.addEventListener("click", () => {
  displayIssues(allIssues);
  setActiveButton(allBtn);
});

openBtn.addEventListener("click", () => {
  const openIssues = allIssues.filter(
    (issue) => issue.status === "open"
  );

  displayIssues(openIssues);
  setActiveButton(openBtn);
});

closedBtn.addEventListener("click", () => {
  const closedIssues = allIssues.filter(
    (issue) => issue.status === "closed"
  );

  displayIssues(closedIssues);
  setActiveButton(closedBtn);
});

loadIssues();