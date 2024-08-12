"use client";

import React, { useState, useEffect, useRef, FC, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/widgets";
import AssetsListItem, { AssetsItem } from "./AssetsListItem";
import trustedMtlAssets from "@/shared/configs/trusted-mtl-assets.json";

const ITEMS_PER_PAGE = 20;

const Assets: FC = () => {
  const searchParams = useSearchParams();
  const paramsSearch = searchParams?.get("search");

  const [filter, setFilter] = useState<string>(paramsSearch || "");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedItems, setDisplayedItems] = useState<AssetsItem[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const filteredItems = trustedMtlAssets.filter(
      (item) => item.code.includes(filter) || item.issuer.includes(filter)
    );
    setDisplayedItems(filteredItems.slice(0, currentPage * ITEMS_PER_PAGE));
  }, [filter, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFilter(formData.get("search") as string);
    setCurrentPage(1);
  };

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
              <div className="row"></div>
            </div>
          </div>
          <ul className="striped space">
            {displayedItems.map((value: AssetsItem, index: number) => (
              <AssetsListItem key={index} item={value} />
            ))}
          </ul>
          <div ref={observerRef} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Assets;
