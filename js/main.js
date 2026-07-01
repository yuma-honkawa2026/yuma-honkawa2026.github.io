/* ==============================
    Modal
============================== */
const modal = document.getElementById("js-modal");

const modalBody = document.querySelector(".c-modal__body");

/* 作品データ */
const works = {
    adobe: {
        title:"Adobe広告",
        type:"人物撮影・合成デザイン",
        tools:"Photoshop・Lightroom Classic",
        images:["images/works-graphic_01.jpg"],
        description:"本作はAdobeブランドの「創造性の解放」をテーマにしたビジュアル広告です。被写体が宙に舞う構図によって、内面から湧き上がるアイデアの躍動を表現しました。",
    },
};

/* 作品データを受け取り、モーダルの中身（c-modal__body）を組み立てる */
function buildModalContent(data) {
    const imageHtml = data.images
    .map((src) => `<img class="c-modal__image" src="${src}" alt="${data.title}">`)
    .join("");

    return `
        <div class="c-modal__media">
            ${imageHtml}
        </div>
        <div class="c-modal__info">
            <h3 class="c-modal__title">${data.title}</h3>
            <p class="c-modal__type">${data.type}</p>
            <p class="c-modal__tools">${data.tools}</p>
            <p class="c-modal__desc">${data.description}</p>
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
document.querySelectorAll(".p-works__list").forEach((track) => {
    const originalItems = Array.from(track.children);

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
    const autoSpeed = 0.12;
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
        virtualScrollLeft = singleSetWidth;
        track.scrollLeft = virtualScrollLeft;
        startAnimation();
    });

    window.addEventListener("resize", () => {
        updateSingleSetWidth();
        virtualScrollLeft = singleSetWidth;
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

