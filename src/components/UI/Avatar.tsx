import React from "react";

type Props = {
    name?: string;
    isActive?: boolean;
    className?: string;
    image?: string | null;
    size?: "sm" | "md" | "lg" | "xl";
};

const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
};

export default function Avatar({
    image,
    name = "",
    size = "xl",
    className = "",
    isActive = false,
}: Props) {
    return (
        <div
            className={`flex justify-center ${sizes[size]} bg-cover bg-center bg-grey items-center rounded-full relative ${className}`}
            style={{
                ...(image && {
                    backgroundSize: "cover",
                    backgroundImage: `url(${image})`,
                    backgroundPosition: "center center",
                }),
            }}
        >
            {!image && (
                <h3 className={`text-white text-${size} text-center`}>{name}</h3>
            )}
            {isActive && (
                <span className="w-3 h-3 absolute bottom-8 left-9 bg-green rounded-full border-2 border-white" />
            )}
        </div>
    );
}
