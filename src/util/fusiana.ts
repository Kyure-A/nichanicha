export const fusianaOrName = (name: string, rawName: string) => {
    const fusianaStr = ["fusianasan", "山崎渉"];
    const isFusiana = !!fusianaStr.filter((x) => x === name).length;

    return isFusiana ? rawName : name;
}

export const fusianaOrId = (name: string, rawId: string, id: string) => {
    const fusianaStr = ["fusianasan", "山崎渉"];
    const isFusiana = !!fusianaStr.filter((x) => x === name).length;

    return isFusiana ? rawId : id;
}
