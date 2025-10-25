// src/components/HeroLikeCarousel/HeroLikeCarousel.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./HeroLikeCarousel.module.css";

export default function HeroLikeCarousel({
    items = [],
    autoPlay = 5000,          // ms | false
    ariaLabel = "Hero promotions",
}) {
    const BLOCK = items.length;                 // số banner gốc
    //const TOTAL = BLOCK * 3;                    // 3 vòng
    const SLIDE_WIDTH = 100 / 3;                 // 33.333%

    const [index, setIndex] = useState(BLOCK);  // bắt đầu ở vòng giữa
    const trackRef = useRef(null);
    const timerRef = useRef(null);
    const hoverRef = useRef(false);

    // ------------------------------------------------------------------
    // 1. Tạo 3 vòng
    // ------------------------------------------------------------------
    const slides = [...items, ...items, ...items];

    // ------------------------------------------------------------------
    // 2. Auto‑play (timeout, không interval)
    // ------------------------------------------------------------------
    const clearTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
    const schedule = useCallback(() => {
        clearTimer();
        if (!autoPlay || BLOCK <= 1 || hoverRef.current) return;
        timerRef.current = setTimeout(() => setIndex(i => i + 1), autoPlay);
    }, [autoPlay, BLOCK]);

    // ------------------------------------------------------------------
    // 3. Khi transition kết thúc → kiểm tra vòng
    // ------------------------------------------------------------------
    const onTransEnd = useCallback(() => {
        let newIdx = index;

        if (index < BLOCK) {
            newIdx = index + BLOCK;
            trackRef.current.style.transition = "none";
        } else if (index >= BLOCK * 2) {
            newIdx = index - BLOCK;
            trackRef.current.style.transition = "none";
        }

        setIndex(newIdx);
        schedule();

        // bật lại transition ngay sau khi nhảy
        requestAnimationFrame(() => {
            trackRef.current.style.transition = "transform 0.6s ease";
        });
    }, [index, BLOCK, schedule]);

    // ------------------------------------------------------------------
    // 4. Cập nhật transform mỗi khi index thay đổi
    // ------------------------------------------------------------------
    useEffect(() => {
        if (!trackRef.current) return;
        const offset = -index * SLIDE_WIDTH;               // % dựa trên 3 slot
        trackRef.current.style.transform = `translateX(${offset}%)`;
    }, [index, SLIDE_WIDTH]);

    // ------------------------------------------------------------------
    // 5. Hover → pause
    // ------------------------------------------------------------------
    const onEnter = () => { hoverRef.current = true; clearTimer(); };
    const onLeave = () => { hoverRef.current = false; schedule(); };

    // ------------------------------------------------------------------
    // 6. Navigation
    // ------------------------------------------------------------------
    const goNext = () => { clearTimer(); setIndex(i => i + 1); };
    const goPrev = () => { clearTimer(); setIndex(i => i - 1); };

    // ------------------------------------------------------------------
    // 7. Dots (chỉ dựa vào BLOCK gốc)
    // ------------------------------------------------------------------
    const realIdx = ((index % BLOCK) + BLOCK) % BLOCK;

    // ------------------------------------------------------------------
    // 8. Khởi động autoplay khi mount
    // ------------------------------------------------------------------
    useEffect(() => {
        if (autoPlay && BLOCK > 1) schedule();
        return clearTimer;
    }, [autoPlay, BLOCK, schedule]);

    // ------------------------------------------------------------------
    // 9. Resize → giữ vị trí (không cần vì % luôn đúng)
    // ------------------------------------------------------------------

    return (
        <section
            className={styles.hero}
            aria-label={ariaLabel}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
        >
            {/* ------------------- VIEWPORT ------------------- */}
            <div className={styles.viewport}>
                <button className={`${styles.nav} ${styles.prev}`} onClick={goPrev} aria-label="Previous">
                    ‹
                </button>

                <div className={styles.trackWrapper}>
                    <div
                        className={styles.track}
                        ref={trackRef}
                        onTransitionEnd={onTransEnd}
                        style={{ transition: "transform 0.6s ease" }}
                    >
                        {slides.map((it, i) => (
                            <div
                                key={`${it.src}-${i}`}
                                className={styles.slide}
                            // optional: highlight active slot (middle one)
                            // style={{ opacity: i === index ? 1 : 0.7 }}
                            >
                                <a href={it.href || "#"} className={styles.card} draggable="false">
                                    <img src={it.src} alt={it.alt || ""} draggable="false" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <button className={`${styles.nav} ${styles.next}`} onClick={goNext} aria-label="Next">
                    ›
                </button>
            </div>

            {/* ------------------- DOTS ------------------- */}
            <div className={styles.dots} role="tablist" aria-label="Slide indicators">
                {items.map((_, i) => (
                    <button
                        key={i}
                        role="tab"
                        aria-selected={realIdx === i}
                        aria-label={`Slide ${i + 1}`}
                        className={`${styles.dot} ${realIdx === i ? styles.active : ""}`}
                        onClick={() => {
                            clearTimer();
                            setIndex(BLOCK + i);          // nhảy thẳng tới slot giữa
                        }}
                    />
                ))}
            </div>
        </section>
    );
}