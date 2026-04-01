/**
 * Draw Engine — handles draw execution logic.
 *
 * Supports two modes:
 *  • RANDOM  — pure random selection from all entries
 *  • ALGORITHM — weighted selection favoring higher average scores
 */

export interface DrawEntryData {
    id: string;
    userId: string;
    averageScore: number;
}

/**
 * Select a winner from draw entries.
 */
export function selectWinner(entries: DrawEntryData[], drawType: "RANDOM" | "ALGORITHM"): DrawEntryData | null {
    if (entries.length === 0) return null;
    if (entries.length === 1) return entries[0];

    if (drawType === "RANDOM") {
        return randomSelect(entries);
    }

    return weightedSelect(entries);
}

/**
 * Pure random selection — equal probability for all.
 */
function randomSelect(entries: DrawEntryData[]): DrawEntryData {
    const index = Math.floor(Math.random() * entries.length);
    return entries[index];
}

/**
 * Weighted selection — higher average Stableford scores get better odds.
 * Weight = score^2 (quadratic to meaningfully reward top performers
 * without making it deterministic).
 */
function weightedSelect(entries: DrawEntryData[]): DrawEntryData {
    const weights = entries.map((e) => Math.pow(Math.max(e.averageScore, 1), 2));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    let random = Math.random() * totalWeight;

    for (let i = 0; i < entries.length; i++) {
        random -= weights[i];
        if (random <= 0) return entries[i];
    }

    // Fallback (shouldn't reach here)
    return entries[entries.length - 1];
}

/**
 * Calculate the prize pool from active subscriptions minus charity contributions.
 */
export function calculatePrizePool(
    subscriptions: Array<{ price: number; contributionPercent: number }>
): { totalRevenue: number; charityTotal: number; prizePool: number } {
    let totalRevenue = 0;
    let charityTotal = 0;

    for (const sub of subscriptions) {
        totalRevenue += sub.price;
        charityTotal += sub.price * (sub.contributionPercent / 100);
    }

    // Platform takes 10% of remaining, rest goes to prize pool
    const afterCharity = totalRevenue - charityTotal;
    const platformFee = afterCharity * 0.1;
    const prizePool = afterCharity - platformFee;

    return {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        charityTotal: Math.round(charityTotal * 100) / 100,
        prizePool: Math.round(prizePool * 100) / 100,
    };
}

/**
 * Calculate the average of the latest N scores for a user.
 */
export function calculateAverageScore(scores: number[], limit = 5): number {
    if (scores.length === 0) return 0;
    const active = scores.slice(0, limit);
    const sum = active.reduce((a, b) => a + b, 0);
    return Math.round((sum / active.length) * 100) / 100;
}
