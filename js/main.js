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

    const friction = 0.94;
    const minVelocity = 0.05;
    /* スピード変更箇所 */
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
    });

    track.addEventListener("pointercancel", () => {
        isDragging = false;
        track.classList.remove("is-dragging");
    });
});