"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const [position, setPosition] = React.useState("Public");

    const changeHander = (e) => {
        const value = e.currentTarget.value;

        setSearch(value);
    };

    const searchHandler = () => {
        if (search == "") {
            return;
        } else {
            const link = document.createElement("a");
            link.href = `https://stellar.expert/explorer/public/account/${search}`;
            link.target = "_blank";
            document.body.append(link);
            link.click();
            link.remove();
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
                            <Button variant={'bordered'} style={{
                              color: '#0691b7',
                              fontSize: '16px'
                            }}>{position}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={position}
                                onValueChange={setPosition}
                            >
                                <DropdownMenuRadioItem value="Public">
                                    Public
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="TestNetwork">
                                    TestNetwork
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
                placeholder="Paste an asset code, tx hash, account address, or ledger sequence here"
            />
        </div>
    );
};

export default SearchBar;
