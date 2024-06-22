import { useState, SyntheticEvent } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { addDays } from "date-fns";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

// Components
import { Input, Button } from "../src/components/UI";

import { logInUser } from "@/src/queries/admin.queries";

import { useData } from "@/src";

const imageBackground = {
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
};

type TLogin = {
    email: string;
    password: string;
};

const Login = () => {
    const { dispatch } = useData();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const loginMuation = useMutation(logInUser);

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        if(!email || !password) {
            return toast.error('Please fill all fields');
        }

        const payload = { email, password};

        loginMuation.mutate(payload, {
            onSuccess: (data: any) => {
                if (data.status) {
                    setCookie("korrecto", data.jwt, {
                        expires: addDays(new Date(), 7),
                        path: "/",
                        sameSite: "strict",
                    });
                    dispatch({
                        isLoggedIn: true,
                        token: data.jwt,
                        user: data.admin,
                    });
                    toast.success(data.message);
                    router.push("/dashboard");
                }
            }
        });
    };

    return (
        <main
            style={imageBackground}
            className="bg-green-korrect min-h-screen px-5 flex-center bg-[url('/mobile-pattern.png')] md:bg-[url('/web-pattern.png')]"
        >
            <div className="max-w-md w-full relative sm:pb-12">
                <section className="mb-6 lg:pt-0 w-full flex justify-center items-center">
                    <Image
                        width={150}
                        height={150}
                        src={'/korrect-logo.svg'}
                        alt="Korrect Logo"
                    />
                </section>
                <div className="card !px-8 !py-16 sm:px-16 sm:py-20">
                    <form className="w-full" onSubmit={handleSubmit}>
                        <h1 className="text-2xl text-center text-black-dark font-semibold mb-4">
                            Login
                        </h1>
                        <div className="w-full mb-6">
                            <Input
                                label="Email Address"
                                placeholder="Enter email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                TrailingIcon={() => (
                                    <div
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="relative"
                                    >
                                        <p className="cursor-pointer">
                                            {!showPassword ? (
                                                <>
                                                    <VisibilityOffOutlinedIcon />
                                                </>
                                            ) : (
                                                <>
                                                    <VisibilityOutlinedIcon />
                                                </>
                                            )}
                                        </p>
                                    </div>
                                )}
                                className="mt-6"
                                type={showPassword ? "text" : "password"}
                            />
                        </div>
                        <Button variant="neutral" loading={loginMuation.isLoading} className="mb-8" type="submit">
                            Login
                        </Button>
                        <div>
                            <p className="text-center text-sm">
                                <span
                                    onClick={() => toast.info("Coming soon")}
                                    className="text-green-korrect cursor-pointer font-semibold"
                                >
                                    Forgot Passsword
                                </span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};


export const getServerSideProps: GetServerSideProps = async ({ req: { cookies } }) => {
    if (cookies.korrecto) {
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false
            }
        };
    }

    return {
        props: {}
    };
}

export default Login;
