import { describe, it, expect } from "vitest";
import {
    calculateAverageScore,
    calculatePrizePool,
    selectWinner,
    DrawEntryData
} from "../services/drawEngine";

describe("drawEngine", () => {
    describe("calculateAverageScore", () => {
        it("should return 0 for empty scores", () => {
            expect(calculateAverageScore([])).toBe(0);
        });

        it("should calculate average of first 5 scores", () => {
            expect(calculateAverageScore([10, 20, 30, 40, 50, 60])).toBe(30);
        });

        it("should calculate average for less than 5 scores", () => {
            expect(calculateAverageScore([10, 20, 30])).toBe(20);
        });

        it("should round to 2 decimal places", () => {
            expect(calculateAverageScore([10, 11, 10])).toBe(10.33);
        });
    });

    describe("calculatePrizePool", () => {
        it("should calculate correct totals with 10% platform fee after charity", () => {
            const subs = [
                { price: 100, contributionPercent: 30 }, // $30 to charity, $70 left
                { price: 200, contributionPercent: 10 }, // $20 to charity, $180 left
            ];
            // Total Revenue: 300
            // Charity Total: 50
            // Remaining: 250
            // Platform Fee (10% of 250): 25
            // Prize Pool: 225
            const result = calculatePrizePool(subs);
            expect(result.totalRevenue).toBe(300);
            expect(result.charityTotal).toBe(50);
            expect(result.prizePool).toBe(225);
        });

        it("should handle empty subscriptions", () => {
            const result = calculatePrizePool([]);
            expect(result.totalRevenue).toBe(0);
            expect(result.charityTotal).toBe(0);
            expect(result.prizePool).toBe(0);
        });
    });

    describe("selectWinner", () => {
        const entries: DrawEntryData[] = [
            { id: "1", userId: "u1", averageScore: 10 },
            { id: "2", userId: "u2", averageScore: 40 },
        ];

        it("should return null for no entries", () => {
            expect(selectWinner([], "RANDOM")).toBeNull();
        });

        it("should return the only entry if length is 1", () => {
            expect(selectWinner([entries[0]], "ALGORITHM")).toEqual(entries[0]);
        });

        it("should eventually select both in RANDOM mode (statistical)", () => {
            const results = new Set();
            for (let i = 0; i < 100; i++) {
                results.add(selectWinner(entries, "RANDOM")!.id);
            }
            expect(results.has("1")).toBe(true);
            expect(results.has("2")).toBe(true);
        });

        it("should favor higher scores in ALGORITHM mode (statistical)", () => {
            let count1 = 0;
            let count2 = 0;
            // Weighs are 10^2=100 and 40^2=1600.
            // u2 should win approx 16/17 of the time.
            for (let i = 0; i < 1000; i++) {
                const winner = selectWinner(entries, "ALGORITHM");
                if (winner!.id === "1") count1++;
                else count2++;
            }
            expect(count2).toBeGreaterThan(count1);
        });
    });
});
