import Papa from "papaparse";
import { Cards, BinderType } from "@/types";

export function parseCSV(text: string): Cards {
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

    if (parsed.errors.length) {
        console.error(parsed.errors);
        throw new Error("CSV parse error");
    }

    const owned: Cards = {};

    parsed.data.forEach((row: any) => {
        const name = row["Name"];
        const quantity = parseInt(row["Quantity"] || "0", 10);

        const binderType: BinderType =
            row["Binder Type"] || "other";

        if (!name || quantity === 0) return;

        if (!owned[name]) {
            owned[name] = {
                quantities: {
                    binder: 0,
                    deck: 0,
                    list: 0,
                    other: 0,
                },
            };
        }

        owned[name].quantities[binderType] += quantity;
    });

    return owned;
}
