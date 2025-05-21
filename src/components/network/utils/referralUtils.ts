
import { ReferralLevel } from "../types/referralTypes";
import { mockReferralData } from "../data/mockReferralData";

export const getReferralPath = (path: string[]): ReferralLevel[] => {
  const result: ReferralLevel[] = [];
  
  // Root level
  if (path.length === 0) {
    result.push({
      level: 1,
      users: mockReferralData["root"]
    });
    return result;
  }
  
  // Build the path
  let currentPath = "root";
  result.push({
    level: 1,
    users: mockReferralData["root"]
  });
  
  for (let i = 0; i < path.length; i++) {
    const userId = path[i];
    currentPath = userId;
    
    if (mockReferralData[currentPath]) {
      result.push({
        level: i + 2, // Level starts at 1 for root
        users: mockReferralData[currentPath]
      });
    }
  }
  
  return result;
};

export const getUserNameFromPath = (userId: string, path: string[]): string => {
  if (path.length === 0) {
    const rootUser = mockReferralData.root.find(u => u.id === userId);
    return rootUser?.name || userId;
  }
  
  const parentId = path[path.length - 2];
  if (parentId && mockReferralData[parentId]) {
    const user = mockReferralData[parentId].find(u => u.id === userId);
    return user?.name || userId;
  }
  
  return userId;
};
