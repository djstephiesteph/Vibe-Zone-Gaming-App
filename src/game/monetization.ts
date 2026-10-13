export interface RewardedAdService {
  isAvailable(): Promise<boolean>;
  showPlacement(placementId: "double-tip" | "rush-recovery"): Promise<{ rewarded: boolean }>;
}

export interface PurchaseService {
  purchaseSku(sku: string): Promise<{ success: boolean; receiptId?: string }>;
  restorePurchases(): Promise<{ restoredSkus: string[] }>;
}

export interface SubscriptionService {
  getStatus(): Promise<{ active: boolean; tier: "none" | "vip-pass" }>;
}

export class NoopRewardedAdService implements RewardedAdService {
  async isAvailable(): Promise<boolean> {
    return false;
  }

  async showPlacement(): Promise<{ rewarded: boolean }> {
    return { rewarded: false };
  }
}

export class NoopPurchaseService implements PurchaseService {
  async purchaseSku(): Promise<{ success: boolean; receiptId?: string }> {
    return { success: false };
  }

  async restorePurchases(): Promise<{ restoredSkus: string[] }> {
    return { restoredSkus: [] };
  }
}

export class NoopSubscriptionService implements SubscriptionService {
  async getStatus(): Promise<{ active: boolean; tier: "none" | "vip-pass" }> {
    return { active: false, tier: "none" };
  }
}
