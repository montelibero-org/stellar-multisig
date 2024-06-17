import React from "react";
import "./header.css";
import Image from "next/image";

const Header = () => {
  return (
    <header>
      <div className="logo">
        <Image
          src="/logo.png"
          alt="Logo"
          className="dark:invert"
          width={30}
          height={30}
          priority
        />
        <h1>MTL Stellar Multisig</h1>
      </div>
      <p>Search Account</p>
    </header>
  );
};

export default Header;
