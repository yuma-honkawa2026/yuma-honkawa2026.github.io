const header = document.querySelector(".l-header");
document.querySelectorAll(".p-career-card[data-org]").forEach((card) => {
    if (!window.matchMedia("(hover: hover) and (min-width: 769px)").matches) return;

    const org = card.dataset.org;
    const targets = document.querySelectorAll(`.p-timeline__item[data-org="${org}"], .p-timeline__range[data-org="${org}"]`);

    card.addEventListener("mouseenter", () => {
        targets.forEach((el) => el.classList.add("is-active"));
    });

    card.addEventListener("mouseleave", () => {
        targets.forEach((el) => el.classList.remove("is-active"));
    });
});

const careerToggles = document.querySelectorAll("[data-career-toggle]");

const setCareerTextVisibility = (card, isVisible) => {
    card?.querySelectorAll(".p-career-card__text").forEach((text) => {
        text.setAttribute("aria-hidden", String(!isVisible));
    });
};

careerToggles.forEach((button) => {
    const card = button.closest(".p-career-card");
    const title = card?.querySelector(".p-career-card__title")?.textContent.trim();

    if (!card || !title) return;

    button.setAttribute("aria-label", title + "の詳細を見る");

    card.addEventListener("click", () => {
        const willOpen = button.getAttribute("aria-expanded") !== "true";

        careerToggles.forEach((otherButton) => {
            const otherCard = otherButton.closest(".p-career-card");
            const otherTitle = otherCard?.querySelector(".p-career-card__title")?.textContent.trim();

            otherCard?.classList.remove("is-expanded");
            setCareerTextVisibility(otherCard, false);
            otherButton.setAttribute("aria-expanded", "false");
            otherButton.textContent = "詳細を見る";

            if (otherTitle) {
                otherButton.setAttribute("aria-label", otherTitle + "の詳細を見る");
            }
        });

        if (!willOpen) return;

        card.classList.add("is-expanded");
        setCareerTextVisibility(card, true);
        button.setAttribute("aria-expanded", "true");
        button.setAttribute("aria-label", title + "の詳細を閉じる");
        button.textContent = "詳細を閉じる";
    });
});

const darkSections = document.querySelectorAll(".p-about, .p-skills, .l-footer");

const updateHeaderTone = () => {
    if (!header) return;

    const line = header.offsetHeight / 2;

    const isDark = [...darkSections].some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= line && rect.bottom >= line;
    });

    document.body.classList.toggle("is-header-dark", isDark);
};

const tabbar = document.querySelector(".p-tabbar");
const heroDetail = document.querySelector(".p-hero__detail");

const updateTabbarReveal = () => {
    if (!tabbar || !heroDetail) return;

    const clearance = tabbar.offsetHeight + 24;
    const isTop = heroDetail.getBoundingClientRect().bottom > window.innerHeight - clearance;

    document.body.classList.toggle("is-hero-top", isTop);
    tabbar.toggleAttribute("inert", isTop);

    if (isTop) {
        tabbar.setAttribute("aria-hidden", "true");
    } else {
        tabbar.removeAttribute("aria-hidden");
    }
};

let toneTicking = false;

const requestHeaderTone = () => {
    if (toneTicking) return;

    toneTicking = true;

    requestAnimationFrame(() => {
        updateHeaderTone();
        updateTabbarReveal();
        toneTicking = false;
    });
};

updateHeaderTone();
updateTabbarReveal();
window.addEventListener("scroll", requestHeaderTone, { passive: true });
window.addEventListener("resize", requestHeaderTone);

const workResultReveals = document.querySelectorAll("[data-result-reveal]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (workResultReveals.length && "IntersectionObserver" in window && !reducedMotion.matches) {
    const workResultObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-revealed");
                workResultObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.35,
            rootMargin: "0px 0px -10% 0px",
        },
    );

    workResultReveals.forEach((result) => {
        result.classList.add("is-reveal-ready");
        workResultObserver.observe(result);
    });
}

let markCurrent = () => {};
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

let scrollFrame = 0;
let isProgrammaticScroll = false;

const scrollToTarget = (target) => {
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const start = window.scrollY;
    const limit = document.documentElement.scrollHeight - window.innerHeight;
    const end = Math.max(0, Math.min(target.getBoundingClientRect().top + start - margin, limit));
    const distance = end - start;

    if (!distance) return;

    const duration = Math.min(1100, Math.max(480, Math.abs(distance) * 0.55));
    const began = performance.now();

    cancelAnimationFrame(scrollFrame);
    isProgrammaticScroll = true;

    const step = (now) => {
        const progress = Math.min(1, (now - began) / duration);

        window.scrollTo({ top: start + distance * easeInOutCubic(progress), behavior: "instant" });

        if (progress < 1) {
            scrollFrame = requestAnimationFrame(step);
            return;
        }

        isProgrammaticScroll = false;
    };

    scrollFrame = requestAnimationFrame(step);
};

const tabbarLinks = document.querySelectorAll("[data-tabbar-link]");

if (tabbarLinks.length && "IntersectionObserver" in window) {
    const sections = [...tabbarLinks].map((link) => document.getElementById(link.dataset.tabbarLink)).filter(Boolean);

    markCurrent = (id) => {
        tabbarLinks.forEach((link) => {
            const isCurrent = link.dataset.tabbarLink === id;

            link.classList.toggle("is-current", isCurrent);

            if (isCurrent) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    const tabbarObserver = new IntersectionObserver(
        (entries) => {
            if (isProgrammaticScroll) return;

            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible) markCurrent(visible.target.id);
        },
        { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => tabbarObserver.observe(section));
    markCurrent("works");
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const id = link.getAttribute("href").slice(1);
        const target = document.getElementById(id);

        if (!target || reducedMotion.matches) return;

        event.preventDefault();

        if (link.dataset.tabbarLink) markCurrent(link.dataset.tabbarLink);

        scrollToTarget(target);
        history.replaceState(null, "", "#" + id);
    });
});
