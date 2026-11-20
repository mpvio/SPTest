import { BannerSummon } from "./bannerSummon";

export interface Profile {
    name: string;
    limitedCharacter: BannerSummon[];
    limitedWeapon: BannerSummon[];
    standardCharacter: BannerSummon[];
    standardWeapon: BannerSummon[];
    beginnerBanner: BannerSummon[];
}

export function createProfile(name: string): Profile {
    return {
        name,
        limitedCharacter: [],
        limitedWeapon: [],
        standardCharacter: [],
        standardWeapon: [],
        beginnerBanner: [],
    };
}

export const bannerTypes = [
    'limitedCharacter',
    'limitedWeapon',
    'standardCharacter',
    'standardWeapon',
    'beginnerBanner'
];

export function getBannerFromProfile(profile: Profile, bannerType: string): BannerSummon[] {
    switch (bannerType) {
        case 'limitedCharacter': return profile.limitedCharacter;
        case 'limitedWeapon': return profile.limitedWeapon;
        case 'standardCharacter': return profile.standardCharacter;
        case 'standardWeapon': return profile.standardWeapon;
        case 'beginnerBanner': return profile.beginnerBanner;
        default: return [];

    }
}

export function setBannerOnProfile(
    profile: Profile,
    bannerType: string,
    banner: BannerSummon[]
): Profile {
    switch (bannerType) {
        case 'limitedCharacter': return { ...profile, limitedCharacter: banner };
        case 'limitedWeapon': return { ...profile, limitedWeapon: banner };
        case 'standardCharacter': return { ...profile, standardCharacter: banner };
        case 'standardWeapon': return { ...profile, standardWeapon: banner };
        case 'beginnerBanner': return { ...profile, beginnerBanner: banner };
        default: return profile;
    }
}