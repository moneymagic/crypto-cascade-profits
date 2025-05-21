
export interface ReferralUser {
  id: string;
  name: string;
  avatar?: string;
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

export interface DatabaseReferral {
  id: string;
  user_id: string;
  referred_user_id: string;
  level: number;
  status: string;
  created_at: string;
  updated_at?: string;
  referred?: {
    full_name: string;
    email: string;
    created_at: string;
    avatar_url?: string;
  };
}
