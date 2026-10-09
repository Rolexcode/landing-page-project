const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

if (menuToggle && mobileMenu) {
  const setMenuState = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
    mobileMenu.classList.toggle("is-open", isOpen);
    mobileMenu.inert = !isOpen;
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) setMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
      menuToggle.focus();
    }
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}


const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".desktop-nav .nav-link");

if ("IntersectionObserver" in window && sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}


// Interactive workspace activity chart with contextual per-period details.
const chartRangeButtons = document.querySelectorAll("[data-chart-range]");
const chartBars = Array.from(document.querySelectorAll("[data-activity-chart] [data-value]"));
const chartContainer = document.querySelector("[data-activity-chart]");
const chartLabels = document.querySelector("[data-chart-labels]");
const periodLabel = document.querySelector("[data-period-label]");
const activityTotal = document.querySelector("[data-activity-total]");

const chartPeriods = {
  week: {
    title: "This week",
    total: "142 tasks",
    values: [38, 54, 47, 72, 63, 86, 76],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    summaries: [
      ["24 tasks completed", "Planning & project setup"],
      ["31 tasks completed", "Design reviews moved forward"],
      ["27 tasks completed", "Team cleared review feedback"],
      ["39 tasks completed", "Two project milestones reached"],
      ["34 tasks completed", "Final handoffs and QA"],
      ["46 tasks completed", "Sprint tasks wrapped up"],
      ["41 tasks completed", "Next week prepared"],
    ],
  },
  month: {
    title: "This month",
    total: "516 tasks",
    values: [46, 64, 52, 77, 69, 92, 84],
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"],
    summaries: [
      ["58 tasks completed", "Roadmap and priorities aligned"],
      ["76 tasks completed", "Design work and reviews"],
      ["63 tasks completed", "Feedback and revisions"],
      ["91 tasks completed", "Core milestone delivered"],
      ["82 tasks completed", "QA and polish"],
      ["104 tasks completed", "Largest sprint of the period"],
      ["42 tasks completed", "Follow-ups and planning"],
    ],
  },
};

let activeChartPeriod = "week";
let selectedChartIndex = null;
let tooltipTimer;

const chartTooltip = document.createElement("div");
chartTooltip.className = "chart-tooltip";
chartTooltip.setAttribute("role", "status");
chartTooltip.setAttribute("aria-live", "polite");
chartTooltip.innerHTML = '<strong></strong><span></span><span class="tooltip-detail"></span>';
if (chartContainer) chartContainer.append(chartTooltip);

function hideChartTooltip() {
  chartTooltip.classList.remove("is-visible");
  chartBars.forEach((bar) => {
    bar.classList.remove("is-selected");
    bar.setAttribute("aria-pressed", "false");
  });
  selectedChartIndex = null;
}

function showChartTooltip(index) {
  const data = chartPeriods[activeChartPeriod];
  const bar = chartBars[index];
  if (!data || !bar) return;

  window.clearTimeout(tooltipTimer);
  selectedChartIndex = index;
  chartBars.forEach((item, itemIndex) => {
    const selected = itemIndex === index;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });

  const [summary, detail] = data.summaries[index];
  const label = activeChartPeriod === "week"
    ? data.labels[index]
    : `Week ${index + 1}`;
  chartTooltip.querySelector("strong").textContent = label;
  chartTooltip.querySelector("span:not(.tooltip-detail)").textContent = summary;
  chartTooltip.querySelector(".tooltip-detail").textContent = detail;

  const barCenter = bar.offsetLeft + bar.offsetWidth / 2;
  const halfTooltip = chartTooltip.offsetWidth / 2;
  const safeCenter = Math.max(halfTooltip + 4, Math.min(chartContainer.clientWidth - halfTooltip - 4, barCenter));
  chartTooltip.style.left = `${safeCenter}px`;
  chartTooltip.classList.add("is-visible");
}

function setChartPeriod(period) {
  const data = chartPeriods[period];
  if (!data) return;

  activeChartPeriod = period;
  hideChartTooltip();

  chartRangeButtons.forEach((button) => {
    const isActive = button.dataset.chartRange === period;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  chartBars.forEach((bar, index) => {
    bar.style.setProperty("--height", `${data.values[index]}%`);
    bar.dataset.value = String(data.values[index]);
    bar.dataset.index = String(index);
    bar.setAttribute("aria-label", `${data.labels[index]}: show activity details`);
  });

  if (chartLabels) {
    chartLabels.replaceChildren(
      ...data.labels.map((label) => {
        const item = document.createElement("span");
        item.textContent = activeChartPeriod === "month" ? label : label.slice(0, 1);
        return item;
      })
    );
  }

  if (periodLabel) periodLabel.textContent = data.title;
  if (activityTotal) activityTotal.textContent = data.total;
}

chartRangeButtons.forEach((button) => {
  button.addEventListener("click", () => setChartPeriod(button.dataset.chartRange));
});

chartBars.forEach((bar, index) => {
  bar.setAttribute("aria-pressed", "false");
  bar.addEventListener("click", () => {
    if (selectedChartIndex === index) {
      hideChartTooltip();
    } else {
      showChartTooltip(index);
    }
  });
  bar.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideChartTooltip();
      bar.focus();
    }
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("[data-activity-chart]") && !event.target.closest("[data-chart-range]")) {
    hideChartTooltip();
  }
});

window.addEventListener("resize", () => {
  if (selectedChartIndex !== null) showChartTooltip(selectedChartIndex);
});
