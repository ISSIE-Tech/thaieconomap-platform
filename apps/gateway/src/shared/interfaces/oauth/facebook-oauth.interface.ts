export interface IFacebookToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface IFacebookPayload {
  accessToken: string;
}

export interface IFacebookProfile {
  id: string;
  name: string;
  email: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}
