const header = document.querySelector(".l-header");
const navButton = document.querySelector(".p-gnav__button");

const closeNav = () => {
    header.classList.remove("is-open");
    navButton.setAttribute("aria-expanded", "false");
    navButton.setAttribute("aria-label", "メニューを開く");
    document.body.style.overflow = "";
};

navButton.addEventListener("click", () => {
    if (header.classList.contains("is-open")) {
        closeNav();
        return;
    }

    header.classList.add("is-open");
    navButton.setAttribute("aria-expanded", "true");
    navButton.setAttribute("aria-label", "メニューを閉じる");
    document.body.style.overflow = "hidden";
});

document.querySelectorAll(".p-gnav__link").forEach((link) => {
    link.addEventListener("click", closeNav);
});

document.querySelectorAll(".p-career-card[data-org]").forEach((card) => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    const org = card.dataset.org;
    const targets = document.querySelectorAll(
        `.p-timeline__item[data-org="${org}"], .p-timeline__range[data-org="${org}"]`
    );

    card.addEventListener("mouseenter", () => {
        targets.forEach((el) => el.classList.add("is-active"));
    });

    card.addEventListener("mouseleave", () => {
        targets.forEach((el) => el.classList.remove("is-active"));
    });
});

const careerToggles = document.querySelectorAll("[data-career-toggle]");

careerToggles.forEach((button) => {
    const card = button.closest(".p-career-card");
    const title = card?.querySelector(".p-career-card__title")?.textContent.trim();

    if (!card || !title) return;

    button.setAttribute("aria-label", title + "の詳細を見る");

    // カードのどこを押しても開閉する。ボタンもカードの中なのでこれで拾える
    card.addEventListener("click", () => {
        const willOpen = button.getAttribute("aria-expanded") !== "true";

        careerToggles.forEach((otherButton) => {
            const otherCard = otherButton.closest(".p-career-card");
            const otherTitle = otherCard?.querySelector(".p-career-card__title")?.textContent.trim();

            otherCard?.classList.remove("is-expanded");
            otherButton.setAttribute("aria-expanded", "false");
            otherButton.textContent = "詳細を見る";

            if (otherTitle) {
                otherButton.setAttribute("aria-label", otherTitle + "の詳細を見る");
            }
        });

        if (!willOpen) return;

        card.classList.add("is-expanded");
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

let toneTicking = false;

const requestHeaderTone = () => {
    if (toneTicking) return;

    toneTicking = true;

    requestAnimationFrame(() => {
        updateHeaderTone();
        toneTicking = false;
    });
};

updateHeaderTone();
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
        }
    );

    workResultReveals.forEach((result) => {
        result.classList.add("is-reveal-ready");
        workResultObserver.observe(result);
    });
}

const activityImages = document.querySelectorAll(".p-activities__image");
const activityCaptions = document.querySelectorAll(".p-activities__caption-text");
const activityDots = document.querySelectorAll(".p-activities__dot");

if (activityImages.length > 1) {
    let activityIndex = 0;
    let activityTimer;

    const showActivity = (next) => {
        activityImages[activityIndex].classList.remove("is-active");
        activityCaptions[activityIndex]?.classList.remove("is-active");
        activityDots[activityIndex]?.classList.remove("is-active");

        activityIndex = (next + activityImages.length) % activityImages.length;

        activityImages[activityIndex].classList.add("is-active");
        activityCaptions[activityIndex]?.classList.add("is-active");
        activityDots[activityIndex]?.classList.add("is-active");

        clearInterval(activityTimer);
        activityTimer = setInterval(() => showActivity(activityIndex + 1), 6000);
    };

    showActivity(0);

    activityDots.forEach((dot, index) => {
        dot.addEventListener("click", () => showActivity(index));
    });
}
