export enum GeneralStackRouteName {
  Home = 'Home',
  Splash = 'Splash',
  Details = 'Details',
}

export type GeneralStackParamList = {
  [GeneralStackRouteName.Splash]: undefined;
  [GeneralStackRouteName.Home]: undefined;
  [GeneralStackRouteName.Details]: {
    photoId: string;
  };
};
