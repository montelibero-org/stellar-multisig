"use client";

// import axios, { AxiosError } from "axios";
// import CurrencyListItem from "./CurrencyListItem";
// const API_URL = "https://api.stellar.expert/explorer/directory";
// import CurrencyListItem from "./CurrencyListItem";
// import { useShallow } from "zustand/react/shallow";
// import { useStore } from "@/features/store";
import React, {
  // useEffect,
  // useCallback,
  useState,
  FC,
  FormEvent,
  useMemo,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/widgets";
import { CurrencyInfo } from "@/shared/types";
import { ITag, popularTags } from "@/shared/lib/popularTags";
import trustedMtlAssets from "@/shared/configs/trusted-mtl-assets.json";
import AssetsListItem, { AssetsItem } from "./AssetsListItem";

const Assets: FC = () => {
  const searchParams = useSearchParams();
  const paramsTagsString = searchParams?.get("tag[]");
  const paramsCursor = searchParams?.get("cursor");
  const paramsSearch = searchParams?.get("search");
  const paramsTags = useMemo(
    () => (paramsTagsString ? paramsTagsString.split(",") : []),
    [paramsTagsString]
  );
  // const router = useRouter();
  const [filter, setFilter] = useState<string>(paramsSearch || "");
  const [currency] = useState<CurrencyInfo>({} as CurrencyInfo);
  // const { net } = useStore(useShallow((state) => ({ net: state.net })));

  // const fetchAssetInfo = useCallback(
  //   async (searchTerm: string) => {
  //     try {
  //       const { data } = await axios.get(API_URL, {
  //         params: searchTerm
  //           ? {
  //               limit: 20,
  //               search: searchTerm,
  //               "tag[]": paramsTags,
  //               cursor: paramsCursor,
  //             }
  //           : {
  //               limit: 20,
  //               "tag[]": paramsTags,
  //               cursor: paramsCursor,
  //             },
  //       });
  //       setCurrency(data);
  //     } catch (error) {
  //       if (error instanceof AxiosError && error.response?.status === 400) {
  //         setCurrency({} as CurrencyInfo);
  //       }
  //       console.error("Error fetching asset info:", error);
  //     }
  //   },
  //   [paramsTags, paramsCursor]
  // );

  // useEffect(() => {
  //   fetchAssetInfo("");
  // }, []);

  // useEffect(() => {
  //   fetchAssetInfo(filter);
  // }, [filter, searchParams]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFilter(formData.get("search") as string);
  };

  const toggleTag = (tag: ITag) => {
    const tagWithoutHash = tag.name.replace("#", "");
    let newTags = [...paramsTags];

    if (newTags.includes(tagWithoutHash)) {
      newTags = newTags.filter((t) => t !== tagWithoutHash);
    } else {
      newTags.push(tagWithoutHash);
    }

    return `?tag[]=${newTags.join(",")}`;
  };

  // const changePage = (direction: "next" | "prev") => {
  //   const records = currency?._embedded?.records;
  //   if (!records) return;

  //   const cursor =
  //     direction === "next"
  //       ? records[records.length - 1].address
  //       : records[0].address;
  //   const order = direction === "next" ? "asc" : "desc";

  //   router.push(
  //     `?tag[]=${paramsTags.join(",")}&cursor=${cursor}&order=${order}`
  //   );
  // };

  const isPrevDisabled: boolean =
    Boolean(filter) ||
    currency?._embedded?.records.length === 0 ||
    !paramsCursor;

  const isNextDisabled: boolean =
    !(currency?._embedded?.records.length < 20) || Boolean(filter);

  console.log(trustedMtlAssets)

  return (
    <MainLayout>
      <div className="container narrow">
        <h2>Trusted MTL Assets</h2>
        <div className="text-right mobile-left" style={{ marginTop: "-2.2em" }}>
          <a
            href="https://github.com/montelibero-org/stellar-multisig/blob/main/src/shared/configs/trusted-mtl-assets.json"
            className="icon icon-github"
            title="Log in with Github"
            style={{ fontSize: "1.4em" }}
          ></a>
        </div>
        <div className="segment blank directory">
          <div className="text-center double-space">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="search"
                className="primary"
                defaultValue={filter}
                placeholder="Search assets by code, or public key"
                style={{ maxWidth: "36em" }}
              />
            </form>
            <div>
              <div className="dimmed text-small">Filter by tag:</div>
              <div className="row">
                {popularTags.map((tag: ITag, index: number) => (
                  <div key={index} className="column column-25">
                    <Link
                      className={`tag-block ${paramsTags.includes(tag.name.replace("#", ""))
                        ? "active"
                        : ""
                        }`}
                      href={toggleTag(tag)}
                    >
                      {tag.name}
                      <span className="description">{tag.desc}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ul className="striped space">
            {/* {currency?._embedded?.records?.map(
              (value: RecordEnemy, index: number) => (
                <CurrencyListItem
                  key={index}
                  paramsTags={paramsTags}
                  RecordEnemy={value}
                  net={net}
                />
              )
            )} */}
            {trustedMtlAssets.map((value: AssetsItem, index: number) => (
              <AssetsListItem
                key={index}
                item={value}
              />
            ))}
          </ul>
          <div className="grid-actions text-center space relative">
            <div className="button-group">
              <button
                className={`button ${isPrevDisabled ? "disabled" : ""}`}
                disabled={isPrevDisabled}
              // onClick={() => !isPrevDisabled && changePage("prev")}
              >
                Prev Page
              </button>
              <button
                className={`button ${isNextDisabled ? "disabled" : ""}`}
                disabled={isNextDisabled}
              // onClick={() => !isNextDisabled && changePage("next")}
              >
                Next Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Assets;
