"use client";

import React, { useState, useEffect, useRef, FC, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/widgets";
import AssetsListItem, { AssetsItem } from "./AssetsListItem";
import assets from "@/shared/configs/trusted-mtl-assets.json";
import Link from "next/link";

const ITEMS_PER_PAGE = 20;

const Assets: FC = () => {
  const searchParams = useSearchParams();
  const paramsSearch = searchParams?.get("search");
  const tags = searchParams?.get("tag[]")?.split(",") || [];
  const [staticTags, setStaticTags] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>(paramsSearch || "");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedItems, setDisplayedItems] = useState<AssetsItem[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const filtredItems = assets.filter(
      (item) =>
        item.code.toLowerCase().includes(filter.toLowerCase()) ||
        item.issuer.toLowerCase().includes(filter.toLowerCase())
    );
    setDisplayedItems(filtredItems.slice(0, currentPage * ITEMS_PER_PAGE));
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

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!filter) {
      const uniqueTags = [...new Set(displayedItems.map((item) => item.tag))];
      setStaticTags(uniqueTags.sort());
    }
  }, [displayedItems, filter]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFilter(formData.get("search") as string);
    setCurrentPage(1);
  };

  const addToHref = (tag: string) => {
    if (!tags[0]) return `?tag[]=${tag}`;
    return `?tag[]=${tags.join(",")},${tag}`;
  };

  const removeFromHref = (tag: string) => {
    return `?tag[]=${tags.filter((t) => t !== tag).join(",")}`;
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
            target="_blank"
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
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search assets by code, or public key"
                style={{ maxWidth: "36em" }}
              />
            </form>
            <div>
              <div className="dimmed text-small">Filter by tag:</div>
              <div className="row">
                {staticTags.map((value: string, index: number) => (
                  <div key={index} className="column column-25">
                    {tags.includes(value) ? (
                      <Link
                        className="tag-block active"
                        href={removeFromHref(value)}
                      >
                        #{value}
                      </Link>
                    ) : (
                      <Link className="tag-block" href={addToHref(value)}>
                        #{value}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ul className="striped space">
            {tags[0]
              ? displayedItems
                  .filter((item) => tags.includes(item.tag))
                  .map((value: AssetsItem, index: number) => (
                    <AssetsListItem key={index} item={value} tags={tags} />
                  ))
              : displayedItems.map((value: AssetsItem, index: number) => (
                  <AssetsListItem key={index} item={value} tags={tags} />
                ))}
          </ul>
          <div ref={observerRef} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Assets;
