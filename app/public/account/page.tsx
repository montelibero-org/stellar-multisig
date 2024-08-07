import React, { FC, Suspense } from "react";
import Account from "@/pages/public/account/account";

const Page: FC = () => (
    <Suspense>
        <Account />
    </Suspense>
);
export default Page;
