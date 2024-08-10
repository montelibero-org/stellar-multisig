export interface ITag {
  name: string;
  desc: string;
}

export const popularTags: ITag[] = [
  {name: "#exchange", desc: "Centralized exchange account"},
  {name: "#anchor", desc: "Operational account of an anchor"},
  {name: "#issuer", desc: "Well known asset issuer account"},
  {name: "#wallet", desc: "Shared account that belongs to a wallet"},
  {name: "#custodian", desc: "Reserved, custodian account, or cold wallet"},
  {name: "#malicious", desc: "Account involved in theft/scam/spam/phishing"},
  {name: "#unsafe", desc: "Obsolete or potentially dangerous account"},
  {name: "#personal", desc: "Personal signing key or account address"},
  {name: "#sdf", desc: "Account under the custody of SDF"},
  {name: "#memo-required", desc: "Destination requires transaction memo"},
  {name: "#airdrop", desc: "Airdrop distribution account"},
  {name: "#obsolete-inflation-pool", desc: "Inflation pool distribution account (obsolete)"}
];