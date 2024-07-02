import PublicNet from "./publicnet";

export async function generateStaticParams() {
    // Fetch or define the possible values for `id`
    const ids = ["account1", "account2", "account3"]; // Example ids
    return ids.map(id => ({ id }));
}

const PublicPage = ({ params }) => {
    const { id } = params;
    return <PublicNet id={id} />;
};

export default PublicPage;
