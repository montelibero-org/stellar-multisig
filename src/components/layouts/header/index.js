import React from "react";
import "./header.css";
import Image from "next/image";

const Header = () => {
  return (
    <header>
      <div className="logo">
        <h1>MTL Stellar Multisig</h1>
        {/* <Image
          src="/stellar.svg"
          alt="Stellar Logo"
          className="dark:invert"
          width={30}
          height={30}
          priority
        /> */}
      </div>
      <p>Search Account</p>
    </header>
  );
};

export default Header;
