import Assets from "@/views/assets/page";
import { Metadata } from "next";
import { FC, Suspense } from "react";

export const metadata: Metadata = {
  title: "Trusted MTL Assets",
  description: "Assets of the Stellar network",
};

const Page: FC = () => (
  <Suspense>
    <Assets />
  </Suspense>
);

export default Page;
