export type View = "grid" | "checklist" | "text" | "full";

type GetCardNameProps = {
    cardElement: Element;
    view: View;
};

export function getCardName({
    cardElement,
    view,
}: GetCardNameProps): string | null {
    switch (view) {
        case "grid":
            return (
                cardElement
                    .querySelector(".card-grid-item-invisible-label")
                    ?.textContent?.trim() || null
            );
        case "checklist":
            return (
                cardElement
                    .querySelector("td:nth-child(3) a")
                    ?.textContent?.trim() || null
            );
        case "text":
            const textElements =
                cardElement.querySelectorAll(".card-text-title");
            if (!textElements.length) return null;
            const textNames = Array.from(textElements).map((element) =>
                Array.from(element.childNodes)
                    .filter((n) => n.nodeType === Node.TEXT_NODE)
                    .map((n) => n.textContent?.trim())
                    .filter(Boolean)
                    .join(" "),
            );
            return textNames.join(" // ");
        case "full":
            const fullElements = cardElement.querySelectorAll(
                ".card-text-card-name",
            );
            if (!fullElements.length) return null;
            const fullNames = Array.from(fullElements).map((element) =>
                Array.from(element.childNodes)
                    .filter((n) => n.nodeType === Node.TEXT_NODE)
                    .map((n) => n.textContent?.trim())
                    .filter(Boolean)
                    .join(" "),
            );
            return fullNames.join(" // ");
    }
}

type GetCardElementsProps = {
    view: View;
};

export function getCardElements({ view }: GetCardElementsProps): HTMLElement[] {
    switch (view) {
        case "grid":
        case "checklist":
            return Array.from(
                document.querySelectorAll<HTMLElement>("[data-card-id]"),
            );
        case "text":
            return Array.from(
                document.querySelectorAll<HTMLElement>(".text-grid-item"),
            );
        case "full":
            return Array.from(
                document.querySelectorAll<HTMLElement>(".card-text"),
            );
    }
}

export function getView(): View | null {
    if (document.querySelector(".card-grid")) return "grid";
    if (document.querySelector(".checklist-wrapper")) return "checklist";
    if (document.querySelector(".text-grid")) return "text";
    if (document.querySelector(".card-profile")) return "full";
    return null;
}
