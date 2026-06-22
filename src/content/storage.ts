import { BinderType, Cards } from "@/types";
import { LOCAL_STORAGE_CARDS } from "@/constants";

export function filterCardsByBinderType(
    cards: Cards,
    binderType: BinderType,
): Cards {
    return Object.fromEntries(
        Object.entries(cards).filter(
            ([, card]) => card.quantities[binderType] > 0,
        ),
    );
}

export async function getCards(): Promise<Cards> {
    const result = await chrome.storage.local.get([LOCAL_STORAGE_CARDS]);
    return (result[LOCAL_STORAGE_CARDS] || {}) as Cards;
}

export async function getListCards(): Promise<Cards> {
    const cards = await getCards();
    return filterCardsByBinderType(cards, "list");
}
