const header = document.querySelector(".l-header");
document.querySelectorAll(".p-career-card[data-org]").forEach((card) => {
    if (!window.matchMedia("(hover: hover) and (min-width: 769px)").matches) return;

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

    // カードのどこを押しても開閉する。ボタンもカードの中なのでこれで拾える
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

// 画面下のタブバーは、ヒーローの名前と学校を読み終わるまで伏せておく
const tabbar = document.querySelector(".p-tabbar");
const heroDetail = document.querySelector(".p-hero__detail");

const updateTabbarReveal = () => {
    if (!tabbar || !heroDetail) return;

    // バーの高さと下の余白のぶんだけ、ヒーローが上へ抜けてから出す
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
        }
    );

    workResultReveals.forEach((result) => {
        result.classList.add("is-reveal-ready");
        workResultObserver.observe(result);
    });
}

// ページ内リンクを自前で動かす。ブラウザ標準の smooth より長く、終わり際を緩める
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

    // 近い時に間延びせず、遠い時に速すぎないよう、距離から時間を出して上下で挟む
    const duration = Math.min(1100, Math.max(480, Math.abs(distance) * 0.55));
    const began = performance.now();

    cancelAnimationFrame(scrollFrame);
    isProgrammaticScroll = true;

    const step = (now) => {
        const progress = Math.min(1, (now - began) / duration);

        // behavior: instant を付けないと CSS の scroll-behavior と競合して跳ねる
        window.scrollTo({ top: start + distance * easeInOutCubic(progress), behavior: "instant" });

        if (progress < 1) {
            scrollFrame = requestAnimationFrame(step);
            return;
        }

        isProgrammaticScroll = false;
    };

    scrollFrame = requestAnimationFrame(step);
};

// 画面下のタブバー。いま画面の中央にある区画を選択中にする
const tabbarLinks = document.querySelectorAll("[data-tabbar-link]");

if (tabbarLinks.length && "IntersectionObserver" in window) {
    const sections = [...tabbarLinks]
        .map((link) => document.getElementById(link.dataset.tabbarLink))
        .filter(Boolean);

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
            // 自前スクロールの途中は、通り過ぎた区画で選択が点滅するので見ない
            if (isProgrammaticScroll) return;

            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible) markCurrent(visible.target.id);
        },
        { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((section) => tabbarObserver.observe(section));
    markCurrent("works");
}

// ヘッダーとタブバーのページ内リンク
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const id = link.getAttribute("href").slice(1);
        const target = document.getElementById(id);

        // 動きを減らす設定の人には、標準の飛び方をそのまま使ってもらう
        if (!target || reducedMotion.matches) return;

        event.preventDefault();

        // 到着を待たずに先へ点ける。押した反応が遅れて見えるのを防ぐ
        if (link.dataset.tabbarLink) markCurrent(link.dataset.tabbarLink);

        scrollToTarget(target);
        history.replaceState(null, "", "#" + id);
    });
});
