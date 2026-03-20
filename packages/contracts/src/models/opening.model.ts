export interface IOpeningTime {
  open: number;
  close: number;
}

export interface IOpening {
  day: string;
  enable: boolean;
  hours: IOpeningTime[];
}

export interface IDisplayOpeningTime {
  open: string;
  close: string;
}

export interface IDisplayOpening {
  days: string;
  time: IDisplayOpeningTime[];
}
