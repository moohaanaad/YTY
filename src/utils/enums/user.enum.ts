

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

export enum UserRole {
    USER = 'user',
    VULONTEER = 'vulonteer',
    ADMIN = 'admin'
}

export enum UserStatus {
    ONLINE = 'online',
    OFFLINE = 'offline'
}

export enum ConfirmEmail {
    PENDING = 'pending',
    VERIFIED = 'verified',
    BLOCKED = 'blocked',
    DELEETED = 'deleted'
}

export enum ConfirmVolunteerRequist {
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
}

export enum joinCommunity {
    PENDING = 'pending',
    JOINED = 'joined',
    REJECTED = 'rejected'
}