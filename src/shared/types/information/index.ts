export type Information = {
  home_domain?: string;
  last_modified_time?: string;
  thresholds?: {
      low_threshold: number;
      med_threshold: number;
      high_threshold: number;
  };
  flags?: {
      auth_required: boolean;
      auth_revocable: boolean;
      auth_immutable: boolean;
      auth_clawback_enabled: boolean;
  };
  signers?: Array<{
      key: string;
      weight: number;
  }>;
  data_attr?: Record<string, string>;
  balances?: Array<{
      balance: string;
      asset_code?: string;
      asset_issuer?: string;
  }>;
  meta_data?: Record<string, string>;
  issuers?: Array<{
      paging_token: string;
      asset_code: string;
      accounts: {
          authorized: number;
      };
  }>;
  tomlInfo?: string;
  entries: Record<string, string>
  created_at?: string;
}

export type Issuer = {
    paging_token: string;
    asset_code: string;
    accounts: {
        authorized: number;
    };
};

export type Signer = {
    key: string;
    weight: number;
}

export type Balance = {
    balance: string;
    asset_code?: string;
    asset_issuer?: string;
    asset_type?: string;
}

export type TomlInfo = {
    tomlInfo: string;
}

export type Entry = {
    key: string;
    value: string;
}