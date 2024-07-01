"use client";

import MainLayout from "@/components/layouts";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePublic } from "@/context/net";
import assetsData from "@/hook/trusted-mtl-assets.json"; // Import the JSON file
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import './assets.css';

const Assets = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialFilter = searchParams.get('filter') || "";
    const initialTags = searchParams.get('tags') ? new Set(searchParams.get('tags').split(",")) : new Set();

    const [filter, setFilter] = useState(initialFilter);
    const [selectedTags, setSelectedTags] = useState(initialTags);
    const [assetsArray, setAssetsArray] = useState([]);
    const [net, setNet] = usePublic();

    useEffect(() => {
        setAssetsArray(assetsData); // Set the initial assets from the imported JSON file
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();
        if (filter) params.set('filter', filter);
        if (selectedTags.size > 0) params.set('tags', Array.from(selectedTags).join(","));
        router.replace(`${pathname}?${params.toString()}`);
    }, [filter, selectedTags, pathname, router]);

    const toggleTag = (tag) => {
        setSelectedTags((prevTags) => {
            const newTags = new Set(prevTags);
            if (newTags.has(tag)) {
                newTags.delete(tag);
            } else {
                newTags.add(tag);
            }
            return newTags;
        });
    };

    const filteredAssets = assetsArray.filter(asset => {
        const assetTag = (asset.tag || "other").toLowerCase();
        const isTagMatch = selectedTags.size === 0 || selectedTags.has(assetTag);
        const isFilterMatch = assetTag.includes(filter.toLowerCase()) ||
            asset.code.toLowerCase().includes(filter.toLowerCase()) ||
            asset.issuer.toLowerCase().includes(filter.toLowerCase());

        return isTagMatch && isFilterMatch;
    });

    function handleSearch(e) {
        e.preventDefault();
    }

    return (
        <MainLayout>
            <div className="container wide">
                <h2>Trusted MTL Assets</h2>
                <div
                    className="text-right mobile-left"
                    style={{ marginTop: "-2.2em" }}
                >
                    <a
                        href="https://github.com/montelibero-org/stellar-multisig/tree/main/src/hook/trusted-mtl-assets.json"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon icon-github"
                        title="View config file on Github"
                        style={{ fontSize: "1.4em" }}
                    ></a>
                </div>
                <div className="segment blank directory">
                    <div className="text-center double-space">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                className="primary"
                                placeholder="Search assets by code, name, domain, or public key"
                                value={filter}
                                onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    e.preventDefault();
                                    setFilter(e.currentTarget.value);
                                }}
                                style={{ maxWidth: "36em" }}
                            />
                        </form>
                        <div>
                            <div className="dimmed text-small">
                                Filter by tag:
                            </div>
                            <div className="row">
                                {[...new Set(assetsArray.map(asset => asset.tag || "other"))].map(tag => (
                                    <div key={tag} className="column column-25">
                                        <a className={`tag-block ${selectedTags.has(tag) ? 'selected' : ''}`} onClick={() => toggleTag(tag)}>
                                            #{tag}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <ul className="striped space">
                        {filteredAssets.map((asset, index) => (
                            <li key={index} style={{padding: '1em', lineHeight: 1.6, overflow: 'hidden'}}>
                                <div>
                                    <b>{asset.code}</b>
                                    &emsp;
                                    {/* <Link href={`https://stellar.expert/explorer/public/asset/${asset.code}-${asset.issuer}`} passHref legacyBehavior>
                                        <a className="text-small" target="_blank" rel="noopener noreferrer">{asset.issuer}</a>
                                    </Link> */}
                                    &emsp;
                                    <span className="inline-tag">#{asset.tag || "other"}</span>
                                </div>
                                <Link href={`/${net}/${asset.issuer}`} passHref legacyBehavior>
                                    <a title={asset.issuer} aria-label={asset.issuer} className="account-address" style={{ marginRight: '1em' }}>
                                        <span className="account-key">{asset.issuer}</span>
                                    </a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </MainLayout>
    );
};

export default Assets;
