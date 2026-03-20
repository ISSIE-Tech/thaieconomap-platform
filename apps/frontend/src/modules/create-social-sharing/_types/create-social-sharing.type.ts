import type { FormValues } from "../create-social-sharing-form/form-validators";

export type ShareOptions = {
  _id: string;
  name: string;
};

export type District = {
  districtId: number;
  districtName: string;
  districtType: string;
  latitude: number;
  longitude: number;
  provinceId: number;
  provinceName: string;
  _id: string;
};

export type additionalImageUpload = {
  code: string;
  data: string[];
  display: string;
  message: string;
};

export type CommercialError = {
  display: string;
  message: string;
};

export type FormSteps = {
  key: string;
  component: React.FC<any>;
  validate: (keyof FormValues)[];
};
