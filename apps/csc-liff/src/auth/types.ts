export type AuthenResponseType = {
  message: string;
  credentials: {
    profile: ProfileType;
    accessToken: string;
  };
};

export type ProfileType = {
  _id: string;
  name: string;
  birthDate: string;
  phoneNumber: string;
  experiences?: string;
  shortId: string;
  districts: [string, string];
  favoritePosts: string[];
  profileImageUrl: string;
} | null;
