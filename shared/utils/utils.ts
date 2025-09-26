export function sumProperty<T>(items: T[], property: keyof T): number {
    return items.reduce((acc, item) => acc + (item[property] as unknown as number), 0);
}