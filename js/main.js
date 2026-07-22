/* ==============================
    リロード時は必ずページ先頭から
============================== */
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
if (location.hash) {
    history.replaceState(null, "", location.pathname);
}
window.scrollTo(0, 0);

/* ==============================
    Modal
============================== */
const modal = document.getElementById("js-modal");

const modalBody = document.querySelector(".c-modal__body");

/* 作品データ */
const works = {
    adobe: {
        title: "Adobe Creative Cloud 広告ポスター",
        type: "人物撮影・合成デザイン",
        tools: "Photoshop・Lightroom Classic / 10h",
        images: ["images/work-graphic_01.jpg"],
        description:
            "「つくろう。今だからできる何かを」というコピーを起点に組み立てた広告ポスター。夜の街を見上げる人物から色とりどりの欠片が舞い上がる合成で、身体の内側からつくりたい衝動があふれ出す瞬間を描きました。欠片の色はCreative Cloudのアプリカラーと呼応させています。",
    },
    realgold: {
        title: "REAL GOLD 広告ポスター",
        type: "物撮り・合成デザイン",
        tools: "Photoshop・Lightroom Classic / 6h",
        images: ["images/work-graphic_02.jpg"],
        description:
            "「REAL GOLD」の名を文字どおり画面の主役に据えた広告ポスター。物撮りした缶を宇宙空間に浮かべ、金の稲妻が貫く瞬間を合成しました。ロゴタイプにも金属の質感を与えエナジードリンクの爆発力を一枚に凝縮しています。",
    },
    clubbell: {
        badge: "Client Work",
        title: "CLUB BELL 店舗看板",
        type: "人物撮影・レタッチ・合成デザイン",
        tools: "Photoshop・Lightroom Classic・Illustrator / 50h",
        images: ["images/work-graphic_03.jpg"],
        description:
            "香川県高松市の店舗から依頼を受けて制作した看板ビジュアル。華やかさが第一に求められる業態に合わせ、人物を光の装飾で包む画面構成と離れた場所からでも読める料金表の情報設計を両立させました。2026年7月現在も店頭で使用されています。",
    },
    bbflyer: {
        badge: "Client Work",
        title: "BB 13周年フライヤー",
        type: "フライヤーデザイン",
        tools: "Photoshop・Illustrator / 30h",
        images: ["images/work-graphic_04.jpg"],
        description:
            "香川県高松市の店舗から依頼を受けた13周年の告知フライヤー。店の顔であるロゴの雰囲気を崩さずに記念日の特別感を出すことが求められた案件です。ロゴを主役に据え、羽と光の粒で華やかな祝祭感に仕上げました。",
    },

    /* Photo */
    portrait: {
        badge: "Client Work",
        title: "宣材撮影",
        type: "撮影・レタッチ",
        tools: "Lightroom Classic・Photoshop",
        images: ["images/work-photo_01.jpg"],
        description:
            "依頼を受けて撮影した宣材ポートレート。背景の照明を大きな色ボケに変えて華やかな空気ごと切り取りつつ、肌のレタッチは清潔感を最優先にしています。",
    },
    seijinshiki: {
        badge: "Client Work",
        title: "成人式前撮り",
        type: "撮影・レタッチ",
        tools: "Lightroom Classic・Photoshop",
        images: ["images/work-photo_02.jpg"],
        description:
            "成人式の前撮りとして依頼を受けた一枚。レースの扇から覗く視線が主役になるように小物と目線の位置関係を調整しながら撮影しました。",
    },
    kitchen: {
        badge: "Client Work",
        title: "BBハウス オーナーポートレート",
        type: "撮影・レタッチ",
        tools: "Lightroom Classic・Photoshop",
        images: ["images/work-photo_03.jpg"],
        description:
            "BBハウスのオーナーを厨房で撮影した一枚。立ち上る炎を主役に据え逆光気味の照明で臨場感を強調しました。店舗のInstagramでも使用されています。",
        links: [
            { label: "Instagramで見る", url: "https://www.instagram.com/p/DU71IE7kyZ0/?igsh=NjdiN2ZpZnU3MnMz" },
        ],
    },
    kagawa: {
        title: "高屋神社 天空の鳥居",
        type: "撮影・レタッチ",
        tools: "Lightroom Classic・Photoshop",
        images: ["images/work-photo_04.jpg"],
        description:
            "香川県の高屋神社「天空の鳥居」。夕方に撮影した一枚をレタッチで夜明け前のような静けさの青に振り切りました。肉眼の色から離れて記憶に残る色をつくるのが狙いです。",
    },

    /* Movie */
    mentai: {
        badge: "Client Work",
        title: "明太とろろ鍋 PRリール",
        type: "動画撮影・動画編集",
        tools: "Premiere Pro / 6h",
        video: "videos/work-movie_01.mp4",
        description:
            "香川県高松市の飲食店の冬限定メニューを告知するInstagramリール。料理の美味しそうなイメージが冒頭1秒で伝わるように動画撮影の段階から意識しました。撮影から編集まで担当し、店舗アカウントで実際に配信されています。",
        links: [
            { label: "Instagramで見る", url: "https://www.instagram.com/reel/DUkofFpk-L3/?igsh=NDR4dmx0NWMwdzh0" },
        ],
    },
    banner: {
        badge: "Client Work",
        title: "Webサイトバナー動画",
        type: "動画撮影・動画編集",
        tools: "After Effects / 20h",
        video: "videos/work-movie_02.mp4",
        poster: "images/work-movie_02.jpg",
        description: "香川県高松市のサービス業のWebサイト向けに制作したメインビジュアル動画。撮影から編集まで担当しました。",
    },
    ryori: {
        badge: "Client Work",
        title: "BBハウス 屋外サイネージ動画",
        type: "動画撮影・動画編集",
        tools: "Premiere Pro / 8h",
        video: "videos/work-movie_03.mp4",
        description:
            "香川県高松市の飲食店・BBハウスの料理PR動画。屋外のデジタルサイネージで放映する前提のため音声なしでもシズル感が伝わるように湯気と照りが際立つカットを軸に構成しました。",
    },
};

/* 作品データを受け取り、モーダルの中身（c-modal__body）を組み立てる */
function buildModalContent(data) {
    let mediaHtml = "";

    if (data.video) {
        const poster = data.poster ? ` poster="${data.poster}"` : "";
        mediaHtml = `<video class="c-modal__video" src="${data.video}"${poster} controls autoplay muted playsinline loop></video>`;
    } else if (data.images) {
        mediaHtml = data.images
            .map((src) => `<img class="c-modal__image" src="${src}" alt="${data.title}">`)
            .join("");
    }

    const linksHtml = data.links
        ? `<div class="c-modal__links">${data.links
            .map((link) => `<a class="c-modal__link" href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`)
            .join("")}</div>`
        : "";

    return `
        <div class="c-modal__media">
            ${mediaHtml}
        </div>
        <div class="c-modal__info">
            <h3 class="c-modal__title">${data.title}</h3>
            <p class="c-modal__type">${data.type}</p>
            <p class="c-modal__tools">${data.tools}</p>
            <p class="c-modal__desc">${data.description}</p>
            ${linksHtml}
        </div>
        `;
}


/* 閉じる処理 */
modal.addEventListener("click", () => {
    modal.classList.add("is-hidden");
});

/* 中身クリックで閉じないように */
const modalWindow = document.querySelector(".c-modal__window");
modalWindow.addEventListener("click", (e) => {
    e.stopPropagation();
});

/* ==============================
    Navの現在位置調整
============================== */
const navLinks = document.querySelectorAll(".p-gnav__link");

// 現在地を示す赤い線（上下にすっと移動する）
const gnav = document.querySelector(".p-gnav");
const navIndicator = document.createElement("span");
navIndicator.className = "p-gnav__indicator";
gnav.appendChild(navIndicator);

function moveNavIndicator(link) {
    if (!link) return;
    navIndicator.style.top = link.offsetTop + "px";
    navIndicator.style.height = link.offsetHeight + "px";
}

window.addEventListener("load", () => {
    moveNavIndicator(document.querySelector(".p-gnav__link--current"));
});

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id; // 今入ってきたセクションのID

                // 全リンクからcurrentを外す
                navLinks.forEach((link) => {
                    link.classList.remove("p-gnav__link--current");
                });

                // このセクションを指すリンクにcurrentを付ける
                const active = document.querySelector(
                    `.p-gnav__link[href="#${id}"]`
                );
                if (active) {
                    active.classList.add("p-gnav__link--current");
                    moveNavIndicator(active);
                }
            }
        });
    },
    {
        rootMargin: "-40% 0px -55% 0px", // 画面の上から40%の線を「現在地」の基準にする
        threshold: 0,
    }
);

// 各セクションを監視開始
document.querySelectorAll("section[id]").forEach((sec) => {
    observer.observe(sec);
});

/* ==============================
    Works横ドラッグ + 慣性 + 無限ループ + 自動スクロール
    ＋カードクリックでモーダルを開く（pointerupに統合）
============================== */
document.querySelectorAll(".p-works__list").forEach((track, trackIndex) => {
    const originalItems = Array.from(track.children);

    // スマホ・タブレットは縦積みなので、ドラッグや自動スクロールは動かさない
    // クリックでモーダルを開くのだけ残す
    if (window.matchMedia("(max-width: 1024px)").matches) {
        track.addEventListener("click", (e) => {
            const card = e.target.closest(".p-works__item");
            if (!card) return;
            const data = works[card.dataset.work];
            if (!data) return;
            modalBody.innerHTML = buildModalContent(data);
            modal.classList.remove("is-hidden");
        });
        return;
    }

    // 偶数行と奇数行でカード半分ぶん開始位置をずらす
    const rowOffset = trackIndex % 2 === 1 ? 266 : 0;

    originalItems.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.classList.add("is-clone");
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
    });

    originalItems.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.classList.add("is-clone");
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
    });

    let isDragging = false;
    let startX = 0;
    let startVirtualScrollLeft = 0;
    let lastX = 0;
    let velocity = 0;
    let animationId = null;

    let virtualScrollLeft = 0;
    let singleSetWidth = 0;

    let downX = 0;
    let downY = 0;
    let downTarget = null;

    const friction = 0.94;
    const minVelocity = 0.05;
    const autoSpeed = 0.24;
    const momentumPower = 1.15;

    function updateSingleSetWidth() {
        const firstClone = track.querySelector(".p-works__item.is-clone");
        if (!firstClone) return;
        singleSetWidth = firstClone.offsetLeft - originalItems[0].offsetLeft;
    }

    function normalizeVirtualScrollPosition() {
        if (singleSetWidth <= 0) return;
        if (virtualScrollLeft >= singleSetWidth * 2) {
            virtualScrollLeft -= singleSetWidth;
        }
        if (virtualScrollLeft <= 0) {
            virtualScrollLeft += singleSetWidth;
        }
        track.scrollLeft = virtualScrollLeft;
    }

    function animate() {
        if (!isDragging) {
            if (Math.abs(velocity) > minVelocity) {
                virtualScrollLeft -= velocity * momentumPower;
                velocity *= friction;
            } else {
                velocity = 0;
                virtualScrollLeft += autoSpeed;
            }
            normalizeVirtualScrollPosition();
        }
        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (animationId !== null) return;
        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener("load", () => {
        updateSingleSetWidth();
        virtualScrollLeft = singleSetWidth + rowOffset;
        track.scrollLeft = virtualScrollLeft;
        startAnimation();
    });

    window.addEventListener("resize", () => {
        updateSingleSetWidth();
        virtualScrollLeft = singleSetWidth + rowOffset;
        track.scrollLeft = virtualScrollLeft;
    });

    track.addEventListener("pointerdown", (e) => {

        if (e.button !== 0) return;

        isDragging = true;
        track.classList.add("is-dragging");

        startX = e.clientX;
        lastX = e.clientX;
        startVirtualScrollLeft = virtualScrollLeft;
        velocity = 0;

        downX = e.clientX;
        downY = e.clientY;
        downTarget = e.target;

        track.setPointerCapture(e.pointerId);
        e.preventDefault();
    });

    track.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        const currentX = e.clientX;
        const diff = currentX - startX;

        virtualScrollLeft = startVirtualScrollLeft - diff;
        track.scrollLeft = virtualScrollLeft;

        velocity = currentX - lastX;
        lastX = currentX;

        normalizeVirtualScrollPosition();
    });

    track.addEventListener("pointerup", (e) => {
        if (!isDragging) return;

        isDragging = false;
        track.classList.remove("is-dragging");

        track.releasePointerCapture(e.pointerId);

        const movedX = Math.abs(e.clientX - downX);
        const movedY = Math.abs(e.clientY - downY);

        if (movedX > 5 || movedY > 5) return;

        const card = downTarget.closest(".p-works__item");
        if (!card) return;

        const workId = card.dataset.work;

        if (!workId) return;

        const data = works[workId];
        if (!data) return;

        modalBody.innerHTML = buildModalContent(data);
        modal.classList.remove("is-hidden");
    });

    track.addEventListener("pointercancel", () => {
        isDragging = false;
        track.classList.remove("is-dragging");
    });
});

/* ==============================
    Careerカードホバーで在籍期間をハイライト
============================== */
/* ==============================
    Heroの写真をゆっくり切り替える
============================== */
const heroImages = document.querySelectorAll(".p-about-hero__image");
if (heroImages.length > 1) {
    let heroIndex = 0;
    setInterval(() => {
        heroImages[heroIndex].classList.remove("is-active");
        heroIndex = (heroIndex + 1) % heroImages.length;
        heroImages[heroIndex].classList.add("is-active");
    }, 4500);
}

document.querySelectorAll(".p-career__detail-card[data-org]").forEach((card) => {
    // タッチ端末はホバーがないので何もしない
    if (!window.matchMedia("(hover: hover)").matches) return;

    const org = card.dataset.org;
    const targets = document.querySelectorAll(
        `.p-career__timeline-item[data-org="${org}"], .p-career__range[data-org="${org}"]`
    );

    card.addEventListener("mouseenter", () => {
        targets.forEach((el) => el.classList.add("is-active"));
    });

    card.addEventListener("mouseleave", () => {
        targets.forEach((el) => el.classList.remove("is-active"));
    });
});

