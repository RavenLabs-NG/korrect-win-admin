import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import React, { ReactNode, useState, useEffect } from "react";
import useData from "../hooks/useData";

import Navbar from "./Navigation/Navbar";
import Sidebar from "./Navigation/Sidebar";

type Props = {
    children?: ReactNode;
    hasNavbar?: boolean;
    showLives?: boolean;
};

const Layout = ({ children }: Props) => {

    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div className="layout bg-green-korrect">
            <Sidebar showSidebar={showSidebar} click={() => setShowSidebar(false)} />
            <main className="p-6 lg:w-[calc(100%-273px)] lg:ml-[273px] ">
                <Navbar click={() => setShowSidebar(!showSidebar)} />
                <div>{children}</div>
            </main>
        </div>
    );
};

export default Layout;


export const getServerSideProps: GetServerSideProps = async ({ req: { cookies } }) => {
    if (!cookies?.korrecto) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        };
    }

    return {
        props: {}
    }
};