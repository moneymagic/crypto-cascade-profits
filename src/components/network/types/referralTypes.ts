
export interface ReferralUser {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  profit: string;
  bonus: string;
  referrals: number;
  date: string;
  status: "active" | "inactive";
}

export interface ReferralLevel {
  level: number;
  users: ReferralUser[];
}

export interface ReferralExplorerProps {
  userId?: string;
}

export interface ReferralPath {
  path: string[];
  setPath: (path: string[]) => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
}
