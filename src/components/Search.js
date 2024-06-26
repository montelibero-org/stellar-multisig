"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePublic } from "@/context/net";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const [net, setNet] = usePublic();
    const router = useRouter();

    const changeHandler = (e) => {
        setSearch(e.currentTarget.value);
    };

    const searchHandler = () => {
        if (search === "") {
            return;
        }
        router.push(`/search/${search}`);
    };

    const keyDownHandler = (e) => {
        if (e.keyCode === 13) {
            searchHandler();
        }
    };

    return (
        <div className="search-wrapper">
            <div
                style={{
                    position: "absolute",
                    right: "1em",
                    color: "#0691b7",
                    cursor: "pointer",
                    opacity: ".3",
                    marginTop: "-8px",
                }}
                onClick={searchHandler}
            >
                <Search />
            </div>
            <input
                className="search"
                value={search}
                onKeyDown={keyDownHandler}
                onChange={changeHandler}
                placeholder="Paste an account address here"
            />
        </div>
    );
};

export default SearchBar;
