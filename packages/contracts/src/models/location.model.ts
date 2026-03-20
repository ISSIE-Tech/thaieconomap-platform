export interface ILocation {
  type: string;
  coordinates: number[] | number[][];
}

export interface ILocationDto {
  latitude: number;
  longitude: number;
}
