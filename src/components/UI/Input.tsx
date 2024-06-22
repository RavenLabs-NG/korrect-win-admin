import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";
import Spinner from "./Spinner";

type Props = {
	label?: string,
	tooltip?: string,
	helptext?: string,
	inputClassName?: string,
    showLeadingIcon?: boolean,
	LeadingIcon?: () => JSX.Element,
	TrailingIcon?: () => JSX.Element,
    loading?: boolean,
	variant?: "normal" | "success" | "error",
	pattern?: string
};

const variants = {
	error: "border-accents-red",
    normal: "border-grey-border md:hover:border-crimson-neutral",
	success: "border-accents-green"
};

const colors = {
	error: "text-accents-red",
	normal: "text-grey-timber",
	success: "text-accents-green"
};

export default function Input(
	props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & Props
) {
	const {
		id,
		label,
		tooltip,
		helptext,
		className,
        showLeadingIcon = true,
		LeadingIcon,
		TrailingIcon,
        loading,
        disabled,
		inputClassName = "",
		pattern,
        variant="normal",
		placeholder,
		type = "text",
		...rest
	} = props;

	return (
		<div className={`bg- ${className} mb-4`}>
			{label && (
				<label className="text-black-neutral text-left text-[0.93rem]" htmlFor={id}>
					{label}
				</label>
			)}
            <div className={`input mt-2 ${inputClassName} ${variants[variant]}`}>
				{LeadingIcon && showLeadingIcon && (
					<span className="ml-2 text-sm">
						<LeadingIcon />
					</span>
				)}
				<input
					{...rest}
					type={type}
					pattern={pattern}
					placeholder={placeholder}
                    disabled={loading || disabled}
                    className={`text-base text-black placeholder:text-black-grey placeholder:font-normal placeholder:text-sm font-normal px-4 flex-grow h-12 min-w-64 bg-transparent outline-none`}
				/>
				{TrailingIcon && (
					<span className="mx-2">
						<TrailingIcon />
					</span>
				)}
                {loading && (
                    <span className="mx-2">
                        <Spinner color="crimson" size={2} />
                    </span>
                )}
			</div>
            {helptext && (
                <small className={`text-xs my-2 ${colors[variant]}`}>{helptext}</small>
            )}
		</div>
	);
}
