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
