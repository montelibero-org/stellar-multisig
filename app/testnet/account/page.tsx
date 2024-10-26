import React, { FC, Suspense } from "react";
import Account from "@/views/account/main";

const Page: FC = () => (
  <Suspense>
    <Account />
  </Suspense>
);
export default Page;
