import { FC } from "react";
import Link from "next/link";

interface HeaderProps {
  title: string;
  button?: boolean;
}

const Header: FC<HeaderProps> = ({ title, button = false }) => (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <h1>{title}</h1>
    {button && (
      <Link href="/public/sign-transaction">
        <button style={{ marginTop: "10px" }}>Clear and import new</button>
      </Link>
    )}
  </div>
);

export default Header;
