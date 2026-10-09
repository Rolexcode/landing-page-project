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


// The workspace chart is a small, functional preview rather than a static decoration.
const chartRangeButtons = document.querySelectorAll("[data-chart-range]");
const chartBars = document.querySelectorAll("[data-activity-chart] [data-value]");
const chartLabels = document.querySelector("[data-chart-labels]");
const periodLabel = document.querySelector("[data-period-label]");
const activityTotal = document.querySelector("[data-activity-total]");

const chartPeriods = {
  week: {
    title: "This week",
    total: "142 tasks",
    values: [38, 54, 47, 72, 63, 86, 76],
    labels: ["M", "T", "W", "T", "F", "S", "S"],
  },
  month: {
    title: "This month",
    total: "516 tasks",
    values: [46, 64, 52, 77, 69, 92, 84],
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"],
  },
};

function setChartPeriod(period) {
  const data = chartPeriods[period];
  if (!data) return;

  chartRangeButtons.forEach((button) => {
    const isActive = button.dataset.chartRange === period;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  chartBars.forEach((bar, index) => {
    bar.style.setProperty("--height", `${data.values[index]}%`);
    bar.dataset.value = String(data.values[index]);
  });

  if (chartLabels) {
    chartLabels.replaceChildren(
      ...data.labels.map((label) => {
        const item = document.createElement("span");
        item.textContent = label;
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
