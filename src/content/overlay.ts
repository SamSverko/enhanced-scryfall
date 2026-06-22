import { BinderType, Cards } from "@/types";
import { getCards } from "@/content/storage";
import { getCardName, getCardElements, getView, View } from "@/content/dom";

const overlayClasses: Record<
    "base" | "counter" | View | BinderType | "unowned" | "total",
    string
> = {
    base: "es-overlay",
    counter: "es-counter",
    grid: "es-view-grid",
    checklist: "es-view-checklist",
    text: "es-view-text",
    full: "es-view-full",
    binder: "es-binderType-binder",
    deck: "es-binderType-deck",
    list: "es-binderType-list",
    other: "es-binderType-other",
    unowned: "es-binderType-unowned",
    total: "es-binderType-total",
};

let cardsCache: Cards = {};

// ----------------------
// lifecycle
// ----------------------
export async function refreshOverlay() {
    cardsCache = await getCards();
    renderAllOverlays();
}

export async function initOverlay() {
    cardsCache = await getCards();
    renderAllOverlays();
}

// ----------------------
// NORMALIZER
// ----------------------
function normalizeQuantities(
    quantities: Partial<Record<BinderType, number>>,
): Record<BinderType, number> {
    return {
        binder: quantities.binder ?? 0,
        deck: quantities.deck ?? 0,
        list: quantities.list ?? 0,
        other: quantities.other ?? 0,
    };
}

// ----------------------
// SINGLE CHIP RENDERER
// ----------------------
function renderChips(
    entries: [string, number][],
    container: HTMLElement,
) {
    container.innerHTML = "";

    for (const [type, qty] of entries) {
        const value = qty ?? 0;

        if (value <= 0) continue;

        const chip = document.createElement("div");

        const className =
            overlayClasses[type as keyof typeof overlayClasses];

        if (className) {
            chip.classList.add(className);
        }

        chip.innerHTML = `<span>${type}</span> <span>${value}</span>`;
        container.appendChild(chip);
    }
}
// ----------------------
// MAIN LOOP
// ----------------------
function renderAllOverlays() {
    const view = getView();
    if (!view) return;

    const cardElements = getCardElements({ view });

    cardElements.forEach((cardElement) =>
        renderCardOverlay({ cardElement, view }),
    );

    renderCounterOverlay({ cardElements, view });
}

// ----------------------
// CARD OVERLAY
// ----------------------
function renderCardOverlay({
    cardElement,
    view,
}: {
    cardElement: Element;
    view: View;
}) {
    const name = getCardName({ cardElement, view });
    if (!name) return;

    let overlay = cardElement.querySelector(
        `.${overlayClasses[view]}`,
    ) as HTMLElement;

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add(overlayClasses.base, overlayClasses[view]);

        if (getComputedStyle(cardElement).position === "static") {
            (cardElement as HTMLElement).style.position = "relative";
        }

        cardElement.appendChild(overlay);
    }
    
    const card = cardsCache[name];

    if (!card) {
        overlay.innerHTML = "";
        renderChips([["unowned", 1]], overlay);
        return;
    }

    const normalized = normalizeQuantities(card.quantities);
    const total = Object.values(normalized).reduce((a, b) => a + b, 0);

    if (total <= 0) {
        overlay.innerHTML = "";
        renderChips([["unowned", 1]], overlay);
        return;
    }

    renderChips(Object.entries(normalized), overlay);
}

// ----------------------
// COUNTER OVERLAY
// ----------------------
function renderCounterOverlay({
    cardElements,
    view,
}: {
    cardElements: Element[];
    view: View;
}) {
    const totals: Record<BinderType | "unowned", number> = {
        binder: 0,
        deck: 0,
        list: 0,
        other: 0,
        unowned: 0,
    };

    const uniqueCards = new Set<string>();

    cardElements.forEach((cardElement) => {
        const name = getCardName({ cardElement, view });
        if (!name) return;

        uniqueCards.add(name);

        const card = cardsCache[name];

        if (!card) {
            totals.unowned += 1;
            return;
        }

        const normalized = normalizeQuantities(card.quantities);

        for (const [type, qty] of Object.entries(normalized)) {
            totals[type as BinderType] += qty;
        }
    });

    let overlay = document.querySelector(
        `.${overlayClasses.counter}`,
    ) as HTMLElement;

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add(overlayClasses.base, overlayClasses.counter);
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = "";

    // 🔥 FIX: explicitly define structure instead of Object.entries(totals)
    renderChips(
        [
            ["binder", totals.binder],
            ["deck", totals.deck],
            ["list", totals.list],
            ["other", totals.other],
            ["unowned", totals.unowned],
        ],
        overlay,
    );

    const totalCopies =
        totals.binder +
        totals.deck +
        totals.list +
        totals.other;

    if (totalCopies > 0) {
        const copiesChip = document.createElement("div");
        copiesChip.classList.add(overlayClasses.total);
        copiesChip.innerHTML = `<span>copies</span> <span>${totalCopies}</span>`;
        overlay.appendChild(copiesChip);
    }

    if (uniqueCards.size > 0) {
        const uniqueChip = document.createElement("div");
        uniqueChip.classList.add(overlayClasses.total);
        uniqueChip.innerHTML = `<span>unique</span> <span>${uniqueCards.size}</span>`;
        overlay.appendChild(uniqueChip);
    }
}