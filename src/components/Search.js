"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [search, setSearch] = useState("");

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
