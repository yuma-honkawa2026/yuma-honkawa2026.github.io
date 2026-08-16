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

    button.addEventListener("click", () => {
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
