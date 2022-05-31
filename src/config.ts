import { BotConfig } from './structures/types'; 

export const config: BotConfig = {
    groupId: 14285673,
    slashCommands: true,
    legacyCommands: {
        enabled: true,
        prefixes: ['..'],
    },
    permissions: {
        all: ['967676830679199744', '948965727405232171'],
        ranking: ['967684006143492107'],
        users: [''],
        verified: ['948974931025207406'],
        shout: ['967684124171190282'],
        join: ['967684153229328424'],
        signal: ['945362316633993226', '945362317464444928'],
        admin: ['949002777684754482', '949002854197231666', '949002827647311902', '949002799511928913', '949002777684754482', '949002740372230144'],
    },
    logChannels: {
        actions: '967683099712450600',
        shout: '',
    },
    database: {
        enabled: true,
        type: 'mongodb',
    },
    api: true,
    maximumRank: 200,
    verificationChecks: true,
    firedRank: 1,
    suspendedRank: 2,
    inactiveRank: 1,
    recordManualActions: true,
    memberCount: {
        enabled: true,
        channelId: '967688161725669428',
        milestone: 100,
        onlyMilestones: false,
    },
     xpSystem: {
        enabled: false,
        autoRankup: false,
        roles: [
            
            {
                rank: 18,
                xp: 10000,
            },
            {
                rank: 17,
                xp: 9000,
            },
            {
                rank: 16,
                xp: 8000,
            },
            {
                rank: 15,
                xp: 7000,
            },
            {
                rank: 14,
                xp: 6000,
            },
            {
                rank: 13,
                xp: 5000,
            },
            {
                rank: 12,
                xp: 3000,
            },
            {
                rank: 11,
                xp: 2000,
            },
            {
                rank: 10,
                xp: 1500,
            },
            {
                rank: 9,
                xp: 900,
            },
            {
                rank: 8,
                xp: 500,
            },
            {
                rank: 7,
                xp: 200,
            },
            {
                rank: 6,
                xp: 100,
            },
            
        ],
    },
    requestChannel: '967688590752637028',
    antiAbuse: {
        enabled: false,
        clearDuration: 1 * 60,
        threshold: 5,
        demotionRank: 3,
        bypassRoleId: '862434154033315881',
    },
    activity: {
        enabled: true,
        type: 'STREAMING',
        url: 'https://twitch.tv/lost_shadow_gamer',
        value: 'promotions | !!help, /help',
    },
    status: 'dnd',
    deleteWallURLs: true,
}
