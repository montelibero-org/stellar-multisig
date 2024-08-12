import { FC } from "react";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";

export interface AssetsItem {
  code: string;
  issuer: string;
  tag: string;
}

type Props = {
  item: AssetsItem;
};

const AssetsListItem: FC<Props> = ({ item }) => {
  const { net } = useStore(
    useShallow((state) => ({
      net: state.net,
    }))
  );

  return (
    <li style={{ padding: "1em", lineHeight: "1.6", overflow: "hidden" }}>
      <div>
        <b>
          <Link
            title={item?.issuer}
            aria-label={item?.issuer}
            className="account-address"
            href={`/${net}/account?id=${item?.issuer}`}
            style={{ marginRight: "1em" }}
          >
            <span className="account-key">{item?.code}</span>
          </Link>
        </b>
        {" "}
        {item?.tag ? (
          <a href="#" className="inline-tag">
            #{item?.tag}
          </a>
        ) : (
          <a href="#" className="inline-tag">
            #other
          </a>
        )}
      </div>
      <Link
            title={item?.issuer}
            aria-label={item?.issuer}
            className="account-address"
            href={`/${net}/account?id=${item?.issuer}`}
            style={{ marginRight: "1em" }}
          >
            <span className="account-key">{item?.issuer}</span>
          </Link>
    </li>
  );
};

export default AssetsListItem;
