import PublicNet from "./testnet";

const PublicPage = ({ params }) => {
    const { id: accountId } = params;  // Assuming `params` contains an `id` field
    return <PublicNet accountId={accountId} />;
};

export async function getServerSideProps(context) {
    const { id } = context.params;  // Get the `id` from the context
    return {
        props: {
            params: { id }
        }
    };
}

export default PublicPage;
