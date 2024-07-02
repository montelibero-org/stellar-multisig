import PublicNet from "./testnet";

export async function generateStaticParams() {
    // Fetch or define the possible values for `id`

    const pathname = window.location.pathname;
    const accountId = pathname.substring(pathname.lastIndexOf("/") + 1);

    return accountId;
}

const PublicPage = ({ params }) => {
    const accountId = params;
    return <PublicNet accountId={accountId} />;
};

export default PublicPage;
