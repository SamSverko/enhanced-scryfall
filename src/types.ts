export type BinderType = "binder" | "deck" | "list" | "other";

export type Card = {
    quantities: Record<BinderType, number>;
};

export type Cards = Record<string, Card>;
