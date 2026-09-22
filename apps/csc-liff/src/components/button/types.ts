export type BackDrawerButtonType = {
  label: string;
  toggleDrawer: (state: boolean) => () => void;
};
