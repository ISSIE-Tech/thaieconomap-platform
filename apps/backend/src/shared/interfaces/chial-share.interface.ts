// Only the fields the cache reads; everything else is stored and served as csc-backend sent it.

export interface IChialShareJobPostMark {
  _id: string;
  title: string;
  category?: { _id: string; name: string } | null;
  location: { type: string; coordinates: [number, number] };
}

export interface IChialShareJobCategory {
  _id: string;
  name: string;
}

export interface IChialShareJobPost {
  _id: string;
  [key: string]: unknown;
}
