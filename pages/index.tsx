import { GetServerSideProps } from 'next';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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