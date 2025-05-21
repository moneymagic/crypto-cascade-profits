
import { ReferralUser } from "../types/referralTypes";

// Sample data - in a real app, this would come from an API
export const mockReferralData: Record<string, ReferralUser[]> = {
  "root": [
    {
      id: "r1",
      name: "João Silva",
      avatar: "",
      rank: "V1",
      profit: "$120.50",
      bonus: "$4.82",
      referrals: 3,
      date: "2025-03-15",
      status: "active"
    },
    {
      id: "r2",
      name: "Ana Paula",
      avatar: "",
      rank: "V1",
      profit: "$85.30",
      bonus: "$3.41",
      referrals: 2,
      date: "2025-04-02",
      status: "active"
    },
    {
      id: "r3",
      name: "Ricardo Gomes",
      avatar: "",
      rank: "V2",
      profit: "$210.75",
      bonus: "$10.54",
      referrals: 5,
      date: "2025-04-18",
      status: "active"
    },
    {
      id: "r4",
      name: "Luciana Costa",
      avatar: "",
      rank: "V1",
      profit: "$56.40",
      bonus: "$2.26",
      referrals: 1,
      date: "2025-03-22",
      status: "active"
    },
  ],
  "r1": [
    {
      id: "r1-1",
      name: "Carlos Oliveira",
      avatar: "",
      rank: "V1",
      profit: "$73.20",
      bonus: "$2.93",
      referrals: 0,
      date: "2025-03-20",
      status: "active"
    },
    {
      id: "r1-2",
      name: "Fernanda Alves",
      avatar: "",
      rank: "V1",
      profit: "$43.50",
      bonus: "$1.74",
      referrals: 2,
      date: "2025-03-25",
      status: "active"
    },
    {
      id: "r1-3",
      name: "Roberto Souza",
      avatar: "",
      rank: "V1",
      profit: "$15.75",
      bonus: "$0.63",
      referrals: 0,
      date: "2025-04-10",
      status: "active"
    }
  ],
  "r2": [
    {
      id: "r2-1",
      name: "Patricia Lima",
      avatar: "",
      rank: "V1",
      profit: "$38.25",
      bonus: "$1.53",
      referrals: 0,
      date: "2025-04-05",
      status: "active"
    },
    {
      id: "r2-2",
      name: "Daniel Santos",
      avatar: "",
      rank: "V1",
      profit: "$22.80",
      bonus: "$0.91",
      referrals: 0,
      date: "2025-04-08",
      status: "active"
    }
  ],
  "r3": [
    {
      id: "r3-1",
      name: "Mariana Ferreira",
      avatar: "",
      rank: "V2",
      profit: "$95.40",
      bonus: "$4.77",
      referrals: 3,
      date: "2025-04-20",
      status: "active"
    },
    {
      id: "r3-2",
      name: "Lucas Pereira",
      avatar: "",
      rank: "V1",
      profit: "$42.60",
      bonus: "$1.70",
      referrals: 0,
      date: "2025-04-22",
      status: "active"
    },
    {
      id: "r3-3",
      name: "Juliana Martins",
      avatar: "",
      rank: "V1",
      profit: "$53.90",
      bonus: "$2.16",
      referrals: 1,
      date: "2025-04-25",
      status: "active"
    },
    {
      id: "r3-4",
      name: "Paulo Rodrigues",
      avatar: "",
      rank: "V1",
      profit: "$28.75",
      bonus: "$1.15",
      referrals: 0,
      date: "2025-05-01",
      status: "active"
    },
    {
      id: "r3-5",
      name: "Camila Almeida",
      avatar: "",
      rank: "V1",
      profit: "$18.30",
      bonus: "$0.73",
      referrals: 0,
      date: "2025-05-05",
      status: "active"
    }
  ],
  "r4": [
    {
      id: "r4-1",
      name: "Felipe Costa",
      avatar: "",
      rank: "V1",
      profit: "$32.15",
      bonus: "$1.29",
      referrals: 0,
      date: "2025-03-30",
      status: "active"
    }
  ],
  "r1-2": [
    {
      id: "r1-2-1",
      name: "Gabriel Silva",
      avatar: "",
      rank: "V1",
      profit: "$25.40",
      bonus: "$1.02",
      referrals: 0,
      date: "2025-04-02",
      status: "active"
    },
    {
      id: "r1-2-2",
      name: "Isabela Santos",
      avatar: "",
      rank: "V1",
      profit: "$18.60",
      bonus: "$0.74",
      referrals: 0,
      date: "2025-04-05",
      status: "active"
    }
  ],
  "r3-1": [
    {
      id: "r3-1-1",
      name: "Eduardo Oliveira",
      avatar: "",
      rank: "V1",
      profit: "$48.30",
      bonus: "$1.93",
      referrals: 0,
      date: "2025-04-23",
      status: "active"
    },
    {
      id: "r3-1-2",
      name: "Bianca Lima",
      avatar: "",
      rank: "V1",
      profit: "$35.75",
      bonus: "$1.43",
      referrals: 0,
      date: "2025-04-26",
      status: "active"
    },
    {
      id: "r3-1-3",
      name: "Rodrigo Pereira",
      avatar: "",
      rank: "V1",
      profit: "$27.90",
      bonus: "$1.12",
      referrals: 0,
      date: "2025-04-30",
      status: "active"
    }
  ],
  "r3-3": [
    {
      id: "r3-3-1",
      name: "Vanessa Sousa",
      avatar: "",
      rank: "V1",
      profit: "$21.45",
      bonus: "$0.86",
      referrals: 0,
      date: "2025-04-28",
      status: "active"
    }
  ]
};
