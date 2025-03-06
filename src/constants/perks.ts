export interface PerkItem {
    title: string;
    description: string;
    icon: string;
}

export const PERKS: PerkItem[] = [
    {
        title: "Tenant Management",
        description: "Track which tenant is renting which unit and when he/she has to pay their rent.",
        icon: "/icons/perk-one.svg"
    },
    {
        title: "Unit Management",
        description: "Track which unit is being rented or is available.",
        icon: "/icons/perk-two.svg"
    },
    {
        title: "Real-time Notifications",
        description: "Receive real-time notifications when rent payment is due for you and your tenant.",
        icon: "/icons/perk-three.svg"
    },
    {
        title: "Automated Notifications",
        description: "Replace the announcements on the notice boards with automated notifications that can be send to individual tenants or multiple tenants at a time.",
        icon: "/icons/perk-four.svg"
    }
]; 