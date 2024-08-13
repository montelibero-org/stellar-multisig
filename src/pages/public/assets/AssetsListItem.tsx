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
  tags: string[];
};

const AssetsListItem: FC<Props> = ({ item, tags }) => {
  const { net } = useStore(
    useShallow((state) => ({
      net: state.net,
    }))
  );

  const addToHref = (tag: string) => {
    if (!tags[0]) return `?tag[]=${tag}`;
    return `?tag[]=${tags.join(",")},${tag}`;
  };

  const removeFromHref = (tag: string) => {
    return `?tag[]=${tags.filter((t) => t !== tag).join(",")}`;
  };

  return (
    <li style={{ padding: "1em", lineHeight: "1.6", overflow: "hidden" }}>
      <div>
        <b>
          <a
            title={item?.issuer}
            aria-label={item?.issuer}
            className="account-address"
            href={`https://stellar.expert/explorer/${net}/asset/${item?.code}-${item?.issuer}`}
            style={{ marginRight: "1em" }}
          >
            <span className="account-key" style={{ fontSize: "1.6rem" }}>
              {item?.code}
            </span>
          </a>
        </b>{" "}
        {item?.tag &&
          (tags.includes(item.tag) ? (
            <Link
              href={removeFromHref(item?.tag)}
              className="inline-tag active"
            >
              #{item?.tag}
            </Link>
          ) : (
            <Link href={addToHref(item?.tag)} className="inline-tag">
              #{item?.tag}
            </Link>
          ))}
      </div>
      <a
        title={item?.issuer}
        aria-label={item?.issuer}
        className="account-address"
        href={`https://stellar.expert/explorer/${net}/asset/${item?.code}-${item?.issuer}`}
        style={{ marginRight: "1em" }}
      >
        <span className="account-key" style={{ fontSize: "1.6rem" }}>
          {item?.issuer}
        </span>
      </a>
    </li>
  );
};

export default AssetsListItem;
