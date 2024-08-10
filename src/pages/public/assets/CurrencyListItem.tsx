import React, { FC } from "react";
import Link from "next/link";
import { RecordEnemy } from "@/shared/types";

type Props = {
  RecordEnemy: RecordEnemy;
  net: string;
  paramsTags: string[];
};

const CurrencyListItem: FC<Props> = ({ RecordEnemy, net, paramsTags }) => (
  <li style={{ padding: "1em", lineHeight: "1.6", overflow: "hidden" }}>
    <div>
      <b>{RecordEnemy?.name}</b>{" "}

      <a href="https://null" className="text-small">
        {RecordEnemy?.domain}
      </a>
      {RecordEnemy?.tags.map((tag: string, index: number) =>
        paramsTags.includes(tag) ? (
          <a key={index} className="inline-tag active">
            #{tag}
          </a>
        ) : (
          <a key={index} className="inline-tag" href="#">
            #{tag}
          </a>
        )
      )}
    </div>
    <Link
      title={RecordEnemy?.address}
      aria-label={RecordEnemy?.address}
      className="account-address"
      href={`/${net}/account?id=${RecordEnemy?.address}`}
      style={{ marginRight: "1em" }}
    >
      <span className="account-key">{RecordEnemy?.address}</span>
    </Link>
  </li>
);

export default CurrencyListItem;
