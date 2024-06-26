"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { usePublic } from "@/context/net";

const SearchBar = ({setParNet}) => {
    const [search, setSearch] = useState("");
    const [net, setNet] = usePublic();
    const router = useRouter();

    const changeHander = (e) => {
        const value = e.currentTarget.value;

        setSearch(value);
    };

    const searchHandler = () => {
        if (search == "") {
            return;
        } else {
            router.push(`/${net}/${search}`);
        }
    };

    const keyDownHandler = (e) => {
        const keyCode = e.keyCode;

        if (keyCode == "13") {
            searchHandler();
        }
    };

    return (
        <div className="search-wrapper">
            <div className="select-network">
                <span className="title">Network&nbsp;</span>
                <div className="dropdown">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="search-btn"
                                style={{
                                    fontSize: "18px",
                                    background: "transparent",
                                }}
                            >
                                {net}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            style={{
                                background: "#0691b7",
                            }}
                        >
                            <DropdownMenuRadioGroup
                                value={net}
                                onValueChange={setNet}
                            >
                                <DropdownMenuRadioItem
                                    value="public"
                                    style={{
                                        fontSize: "14px",
                                        color: "white",
                                    }}
                                >
                                    Public
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem
                                    value="testnet"
                                    style={{
                                        fontSize: "14px",
                                        color: "white",
                                    }}
                                >
                                    Testnet
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div
                style={{
                    position: "absolute",
                    right: "1em",
                    color: "#0691b7",
                    cursor: "pointer",
                    opacity: ".3",
                    marginTop: "-8px",
                    cursor: "pointer",
                }}
                onClick={searchHandler}
            >
                <Search />
            </div>
            <input
                className="search"
                value={search}
                onKeyDown={keyDownHandler}
                onChange={changeHander}
                placeholder="Paste an account address here"
            />
        </div>
    );
};

export default SearchBar;
