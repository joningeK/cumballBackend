
export type task = {
    rowKey?: string;
    title: string;
    description: string;
    score: number;
}


export type player = {
    rowKey?: string;
    name: string;
    club?: string;
    teamId?: string;
}



export type team = {
    rowKey?: string;
    name: string;    
}


export type taskState = {
    rowKey?: string;
    teamId: string;
    state: state;
}



export type comment = {
    rowKey?: string;
    teamId: string;
    taskId: string;
    comment: string;
}


export enum state {
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED"
}