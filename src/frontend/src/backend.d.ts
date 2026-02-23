import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Event {
    id: string;
    startTime: Time;
    title: string;
    endTime: Time;
    description: string;
    location: string;
    eventType: EventType;
}
export interface News {
    id: string;
    title: string;
    postedBy: string;
    content: string;
    timestamp: Time;
}
export interface Member {
    name: string;
    role: MemberRole;
}
export interface UserProfile {
    bio: string;
    joinDate: Time;
    name: string;
    memberRole?: MemberRole;
}
export enum EventType {
    social = "social",
    other = "other",
    ride = "ride",
    meeting = "meeting",
    fundraiser = "fundraiser"
}
export enum MemberRole {
    member = "member",
    vicePresident = "vicePresident",
    secretary = "secretary",
    roadCaptain = "roadCaptain",
    guest = "guest",
    treasurer = "treasurer",
    president = "president"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEvent(title: string, description: string, startTime: Time, endTime: Time, location: string, eventType: EventType): Promise<void>;
    addMember(name: string, role: MemberRole): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEvents(): Promise<Array<Event>>;
    getMembers(): Promise<Array<Member>>;
    getNewsFeed(): Promise<Array<News>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    postNews(title: string, content: string, postedBy: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
