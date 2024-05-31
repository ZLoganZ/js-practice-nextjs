export enum ActiveYn {
  Y = 'Y',
  N = 'N'
}

export type User = {
  username: string;
  fullname: string;
  role: string;
  project: string[];
  activeYn: ActiveYn;
};
