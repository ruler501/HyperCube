export function normalizeName(name: any): any;
export function encodeName(name: any): string;
export function decodeName(name: any): string;
export function cardsAreEquivalent(a: any, b: any): boolean;
export const COLOR_COMBINATIONS: string[][];
export const COLOR_INCLUSION_MAP: {
    [k: string]: {
        [k: string]: any;
    };
};
export function mainboardRate({ mainboards, sideboards }: {
    mainboards: any;
    sideboards: any;
}): number;
export function pickRate({ picks, passes }: {
    picks: any;
    passes: any;
}): number;
export function cardTags(card: any): any;
export function cardFinish(card: any): any;
export function cardStatus(card: any): any;
export function cardColorIdentity(card: any): any;
export function cardCmc(card: any): any;
export function cardId(card: any): any;
export function cardType(card: any): any;
export function cardRarity(card: any): any;
export function cardAddedTime(card: any): any;
export function cardImageUrl(card: any): any;
export function cardImageBackUrl(card: any): any;
export function cardNotes(card: any): any;
export function cardColorCategory(card: any): any;
export function cardPrice(card: any): any;
export function cardNormalPrice(card: any): any;
export function cardFoilPrice(card: any): any;
export function cardPriceEur(card: any): any;
export function cardTix(card: any): any;
export function cardIsFullArt(card: any): any;
export function cardCost(card: any): any;
export function cardSet(card: any): any;
export function cardCollectorNumber(card: any): any;
export function cardPromo(card: any): any;
export function cardDigital(card: any): any;
export function cardIsToken(card: any): any;
export function cardBorderColor(card: any): any;
export function cardName(card: any): any;
export function cardNameLower(card: any): any;
export function cardFullName(card: any): any;
export function cardArtist(card: any): any;
export function cardScryfallUri(card: any): any;
export function cardOracleText(card: any): any;
export function cardOracleId(card: any): any;
export function cardLegalities(card: any): any;
export function cardLegalIn(card: any): string[];
export function cardColors(card: any): any;
export function cardLanguage(card: any): any;
export function cardMtgoId(card: any): any;
export function cardTcgplayerId(card: any): any;
export function cardLoyalty(card: any): any;
export function cardPower(card: any): any;
export function cardToughness(card: any): any;
export function cardImageSmall(card: any): any;
export function cardImageNormal(card: any): any;
export function cardArtCrop(card: any): any;
export function cardImageFlip(card: any): any;
export function cardTokens(card: any): any;
export function cardElo(card: any): any;
export function cardPopularity(card: any): string;
export function cardCubeCount(card: any): any;
export function cardPickCount(card: any): any;
export function cardLayout(card: any): any;
export function cardReleaseDate(card: any): any;
export function cardDevotion(card: any, color: any): any;
export function cardIsSpecialZoneType(card: any): boolean;
export namespace CARD_CATEGORY_DETECTORS {
    export function gold(details: any): any;
    export function twobrid(details: any): any;
    export function hybrid(details: any): any;
    export function phyrexian(details: any): any;
    export function promo(details: any): any;
    export function reprint(details: any): any;
    export function firstprint(details: any): boolean;
    export function firtprinting(details: any): boolean;
    export function digital(details: any): any;
    export function reasonable(details: any): boolean;
    export function dfc(details: any): boolean;
    export function mdfc(details: any): boolean;
    export function meld(details: any): boolean;
    export function tdfc(details: any): boolean;
    export function transform(details: any): boolean;
    export function flip(details: any): boolean;
    export function split(details: any): boolean;
    export function leveler(details: any): boolean;
    export function commander(details: any): any;
    export function spell(details: any): boolean;
    export function permanent(details: any): boolean;
    export function historic(details: any): any;
    export function vanilla(details: any): boolean;
    export function modal(details: any): any;
    export { isCreatureLand as creatureland };
    export { isCreatureLand as manland };
    export function foil(details: any, card: any): any;
    export function nonfoil(details: any, card: any): any;
    export function fullart(details: any): any;
    export function bikeland(details: any): boolean;
    export function cycleland(details: any): boolean;
    export function bicycleland(details: any): boolean;
    export function bounceland(details: any): boolean;
    export function karoo(details: any): boolean;
    export function canopyland(details: any): boolean;
    export function canland(details: any): boolean;
    export function checkland(details: any): boolean;
    export function dual(details: any): boolean;
    export function fastland(details: any): boolean;
    export function filterland(details: any): boolean;
    export function fetchland(details: any): boolean;
    export function gainland(details: any): boolean;
    export function painland(details: any): boolean;
    export function scryland(details: any): boolean;
    export function shadowland(details: any): boolean;
    export function shockland(details: any): boolean;
    export function storageland(details: any): boolean;
    export function triland(details: any): boolean;
    export function tangoland(details: any): boolean;
    export function battleland(details: any): boolean;
}
export const CARD_CATEGORIES: string[];
export function makeSubtitle(cards: any): string;
export function reasonableCard(card: any): boolean;
declare namespace _default {
    export { cardTags };
    export { cardFinish };
    export { cardStatus };
    export { cardColorIdentity };
    export { cardCmc };
    export { cardId };
    export { cardType };
    export { cardRarity };
    export { cardAddedTime };
    export { cardImageUrl };
    export { cardNotes };
    export { cardColorCategory };
    export { cardCost };
    export { cardIsFullArt };
    export { cardPrice };
    export { cardFoilPrice };
    export { cardNormalPrice };
    export { cardSet };
    export { cardCollectorNumber };
    export { cardPromo };
    export { cardDigital };
    export { cardIsToken };
    export { cardBorderColor };
    export { cardName };
    export { cardNameLower };
    export { cardFullName };
    export { cardArtist };
    export { cardScryfallUri };
    export { cardOracleText };
    export { cardOracleId };
    export { cardLegalities };
    export { cardLegalIn };
    export { cardColors };
    export { cardLanguage };
    export { cardMtgoId };
    export { cardTcgplayerId };
    export { cardLoyalty };
    export { cardPower };
    export { cardToughness };
    export { cardImageSmall };
    export { cardImageNormal };
    export { cardArtCrop };
    export { cardImageFlip };
    export { cardTokens };
    export { cardDevotion };
    export { cardLayout };
    export { cardIsSpecialZoneType };
    export { cardElo };
    export { cardPopularity };
    export { cardCubeCount };
    export { cardPickCount };
    export { COLOR_COMBINATIONS };
    export { normalizeName };
    export { encodeName };
    export { decodeName };
    export { cardsAreEquivalent };
    export { makeSubtitle };
}
export default _default;
declare function isCreatureLand(details: any): any;
//# sourceMappingURL=Card.d.ts.map