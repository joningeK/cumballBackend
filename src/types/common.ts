export type task = {
  taskId?: string;
  title: string;
  description: string;
  points: number;
  isBonus: boolean;
};

export type taskImage = {
  taskId?: string;
  teamId?: string;
  image: string;
  points: number;
  isBonus: boolean;
};

export type player = {
  rowKey?: string;
  name: string;
  club?: string;
  teamId?: string;
};

export type team = {
  rowKey?: string;
  name: string;
  username: string;
  // passwordHash: string;
};

export type teamRequest = {
  username: string;
  password: string;
};

export type taskSubmission = {
  rowKey?: string;
  teamId: string;
  state: state;
};

export type comment = {
  rowKey?: string;
  teamId: string;
  taskId: string;
  comment: string;
};

export enum state {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
}
