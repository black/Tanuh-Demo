export type Suspicious = "yes" | "no" | null;

export type CapturedImageRecord = {
  id: string;
  siteId: string;
  siteName: string;
  imageUrl: string;
  suspicious: Suspicious;
};

export type ReferralAnswer = "yes" | "no" | null;

export type ReferralDetails = {
  referToDentist: ReferralAnswer;
  district: string | null;
  hospital: string | null;
};
