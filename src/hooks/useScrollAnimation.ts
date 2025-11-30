import { useEffect } from "react";

export default function useScrollAnimation(selector = ".fade-in-up") {
    useEffect(() => {
        const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.12 }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [selector]);
}
