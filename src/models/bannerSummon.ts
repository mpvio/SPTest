export interface BannerSummon {
    time: Date;
    id: number;
    pity: number;
}

export function getLastPity(banner: BannerSummon[]): number {
    if (banner.length === 0) {
        return 0;
    } else {
        return banner[banner.length - 1].pity;
    }
}