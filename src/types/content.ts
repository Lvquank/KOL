export type NewsItem = {
  title: string;
  image: string;
  sourcePath: string;
  date: string;
};

export type RankedPerson = {
  rank: number;
  name: string;
  legalName: string;
  image: string;
  metric: string;
  delta: string;
};

export type RankedNetwork = {
  rank: number;
  name: string;
  detail: string;
  image: string;
  metric: string;
  delta: string;
};

export type SocialItem = {
  rank: number;
  name: string;
  score: string;
  image: string;
};
