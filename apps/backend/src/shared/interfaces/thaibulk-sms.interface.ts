export interface IRequestOtpResponse {
  status: string;
  token: string;
  refno: string;
}

export interface IVerifyOtpResponse {
  status: string;
  message: string;
}
