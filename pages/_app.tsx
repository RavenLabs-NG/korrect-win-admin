import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";

import "react-toastify/dist/ReactToastify.css";
import "react-datetime/css/react-datetime.css";

import { DataProvider } from '@/src'
import { AppData } from '@/src/types'

const contextClass = {
    success: "bg-green-100 text-green",
    error: "bg-white text-red",
    info: "bg-blue-600",
    warning: "bg-orange-400",
    default: "bg-indigo-600",
    dark: "bg-white-600 font-gray-300"
};

const init: AppData = {
    // @ts-ignore
    user: {},
    token: "",
    isLoggedIn: false,
};

const inter = Inter({
    subsets: ["latin"], display: "swap", weight: ['300', '400', '500', '600', '700', '800'] });
// const workSans = Work_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export default function App({ Component, pageProps }: AppProps) {
    const queryclient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                cacheTime: 1000 * 60 * 15,
                staleTime: 1000 * 60 * 30
            },
        },
    });

    const MyComponent = Component as any;

    return (
        <DataProvider init={init}>
            <QueryClientProvider client={queryclient}>
                <Hydrate state={pageProps.queryDehydratedState}>
                    <ToastContainer
                        hideProgressBar={true}
                        autoClose={4000}
                        toastClassName={({ type }: any) =>
                            //@ts-ignore
                            contextClass[type || "default"] +
                            " relative flex p-3 min-h-14 max-w-sm shadow text-sm rounded-md justify-between overflow-hidden cursor-pointer"
                        }
                    />
                    <style jsx global>
                        {`
				        html {
					        font-family: ${inter.style.fontFamily};
				        }
			        `}
                    </style>
                    <Head>
                        <title>Korrect Predict</title>
                        <meta name="description" content="Win loads of prizes by predicting football games" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <link rel="icon" href="/vdl.png" />
                    </Head>
                    <MyComponent {...pageProps} />
                </Hydrate>
            </QueryClientProvider>
        </DataProvider>
    )
}