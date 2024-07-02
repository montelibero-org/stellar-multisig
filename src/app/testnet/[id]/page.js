import PublicNet from "./testnet";

export async function generateStaticParams() {
    // Fetch or define the possible values for `id`
    const ids = []; // Example ids
    return ids.map(id => ({ id }));
}

const PublicPage = ({ params }) => {
    const { id } = params;
    return <PublicNet id={id} />;
};

export default PublicPage;
