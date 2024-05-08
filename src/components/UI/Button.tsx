import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import Spinner from "./Spinner";
import React from "react";

type Props = {
    icon?: string;
    loading?: boolean;
    size?: "sm" | "md" | "lg";
    variant?: "green" | "plain" | "neutral" | "normal" | "neutral_blue" | "plain_accent";
};

const variants = {
    neutral:
        "bg-green-korrect md:hover:bg-transparent md:hover:text-green-korrect text-white-pure border-2 border-solid border-green-korrect",
    neutral_blue:
        "bg-[#264EB5] md:hover:bg-transparent md:hover:text-[#264EB5] text-white-pure border-2 border-solid border-[#E6E6E6]",
    plain_accent:
        "bg-transparent md:hover:bg-[#264EB5] md:hover:text-white text-white-pure border-2 border-solid border-[#E6E6E6]",
    plain: "bg-transparent md:hover:bg-crimson-main md:hover:text-white-pure border-2 border-solid border-accents-crimson text-crimson-text",
    green: "bg-green-neutral md:hover:bg-green-main text-white-pure",
    normal: "bg-transparent border border-solid border-grey-border md:hover:border-green-neutral text-black"
};

const sizes = {
    sm: "p-1 min-w-128",
    md: "p-2 min-w-152",
    lg: "p-3 min-w-196"
};

export default function Button(
    props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & Props
) {
    const {
        loading,
        disabled,
        children,
        className,
        size = "lg",
        type = "button",
        variant = "neutral",
        ...rest
    } = props;

    return (
        <button
            {...rest}
            type={type}
            disabled={loading || disabled}
            className={`button ${variants[variant]} my-2 ${sizes[size]} w-full ${className}`}
        >
            {loading ? <Spinner color="gray" size={1.7} /> : <>{children}</>}
        </button>
    );
}
