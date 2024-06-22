import { GetServerSideProps } from 'next';

export default function Home() {
    return (
        <div></div>
    )
}


export const getServerSideProps: GetServerSideProps = async ({
    req: { cookies }
}) => {
    if (cookies.korrecto) {
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false
            }
        };
    }

    return {
        redirect: {
            destination: "/login",
            permanent: false
        }
    };
};