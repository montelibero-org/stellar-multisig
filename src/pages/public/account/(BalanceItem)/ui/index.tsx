import { FC } from "react";
import Link from "next/link";
import { collapseAccount } from "@/pages/public/account/publicnet";
import { Balance } from "@/shared/types";

interface Props {
  number: string;
  decimal: string;
  item: Balance;
}

const BalanceItem: FC<Props> = ({ number, decimal, item }) => {
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
          aria-label={item?.asset_code || "Asset"}
          className="asset-link"
          href={`https://stellar.expert/explorer/public/asset/${
            item?.asset_code || "XLM"
          }-${item?.asset_issuer}`}
          target="_blank"
        >
          {item?.asset_code || "XLM"}
        </a>
      </td>
      <td
        style={{
          textAlign: "left",
          width: "33.3%",
        }}
      >
        <Link href={`/public/account?id=${item?.asset_issuer}`}>
          {collapseAccount(item?.asset_issuer || "")}
        </Link>
      </td>
    </tr>
  );
};

export default BalanceItem;
