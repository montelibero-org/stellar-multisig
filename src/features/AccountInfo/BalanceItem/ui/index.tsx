import { FC } from "react";
import Link from "next/link";
import { collapseAccount } from "@/shared/helpers";
import { Balance } from "@/shared/types";

interface Props {
  number: string;
  decimal: string;
  item?: Balance;
}

const BalanceItem: FC<Props> = ({ number, decimal, item }) => {
  const assetCode = item?.asset_code || "XLM";
  const assetIssuer = item?.asset_issuer ? `${item?.asset_issuer}` : "";

  return (
    <tr>
      <td
        style={{
          textAlign: "left",
          width: "25%",
        }}
      >
        {number}
        {decimal}
      </td>
      <td
        style={{
          textAlign: "left",
          width: "33.3%",
        }}
      >
        <a
          aria-label={assetCode}
          className="asset-link"
          href={`https://stellar.expert/explorer/public/asset/${assetCode}${assetCode === "XLM" ? "" : "-"}${assetIssuer}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {assetCode}
        </a>
      </td>
      <td
        style={{
          textAlign: "left",
          width: "33.3%",
        }}
      >
        <Link href={`/public/account?id=${assetIssuer}`}>
          {collapseAccount(assetIssuer)}
        </Link>
      </td>
    </tr>
  );
};

export default BalanceItem;
