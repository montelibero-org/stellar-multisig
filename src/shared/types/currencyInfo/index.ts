export interface CurrencyInfo {
  _embedded: {
    records: RecordEnemy[]
  },
  _links: Links
}

export interface RecordEnemy {
  address: string
  domain?: string
  name?: string
  paging_token: string
  tags: string[]
}

export interface Links {
  self: Link
  prev: Link
  next: Link
}

export interface Link {
  href: string
}