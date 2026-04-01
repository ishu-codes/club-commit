import { Subscription } from "./subscription";
import { GolfScore } from "./score";
import { Draw } from "./draw";
import { Winner } from "./winner";

export interface DashboardData {
    subscription: Subscription | null;
    scores: {
        active: GolfScore[];
        recent: GolfScore[];
        average: number;
        total: number;
    };
    draws: {
        entries: any[];
        upcoming: Draw[];
        totalEntered: number;
    };
    winnings: {
        list: Winner[];
        totalWon: number;
        pendingPayments: number;
    };
}
