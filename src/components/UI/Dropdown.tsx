import React, {
    ChangeEventHandler,
    DetailedHTMLProps,
    InputHTMLAttributes,
    LegacyRef,
    useEffect,
    useState,
} from "react";
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

import Input from "./Input";
import { ClickOutside } from "@/src/hooks/useClickOutside";

export interface DropdownOption<T = string> {
    value: T;
    label?: JSX.Element | string;
    img?: string;
    country?: string;
}

type Props = DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
> & {
    label?: string;
    tooltip?: string;
    className?: string;
    searchable?: boolean;
    defaultValue?: string;
    data: DropdownOption[];
    innerRef?: LegacyRef<HTMLInputElement>;
    getValue?: (value: DropdownOption<any>) => string;
    filter?: (option: DropdownOption<any>, search: string) => boolean;
};

export default function DropDown({
    label,
    filter,
    innerRef,
    onChange,
    getValue,
    className,
    data = [],
    defaultValue = "",
    searchable = false,
    ...rest
}: Props) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState(data);
    const [value, setValue] = useState(defaultValue);
    const [img, setImg] = useState('');

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
        if (open) {
            setOptions(data);
        }
    }, [open, data]);

    useEffect(() => {
        setOptions(data);
    }, [data]);

    const search: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (filter) {
            setOptions([...data.filter((o) => filter(o, e.target.value))]);
            return;
        }

        setOptions([
            ...data.filter((o) =>
                //@ts-ignore
                o.label.toLowerCase().includes(e.target.value.toLowerCase())
            ),
        ]);
    };

    return (
        <ClickOutside
            className={`relative ${className} no-scrollbar`}
            onclickoutside={() => setOpen(false)}
        >
            <Input
                {...rest}
                label={label}
                value={value}
                ref={innerRef}
                onChange={onChange}
                onClick={() => setOpen(true)}
                // activeInput={value !== ""}
                TrailingIcon={() =>
                    <div onClick={() => setOpen(!open)} className="relative">
                        {open ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />}
                    </div>
                }
                LeadingIcon={() => (
                    <div>
                        <img
                            src={img}
                            alt={'League'}
                            className="w-6 h-6"
                        />
                    </div>
                )}
                showLeadingIcon={img ? true : false}
            />
            {open && (
                <div
                    className={
                        "shadow-[0_1px_4px_rgba(0,0,0,0.16)] absolute z-10 bg-white my-2 w-full rounded-2xl p-4"
                    }
                >
                    <div className={`relative ${searchable ? "h-72" : "h-60"}`}>
                        {searchable && (
                            <input
                                className="top-0 h-10 text-base mb-3 w-full px-4 bg-transparent outline-none text-black-jungle border border-grey-platinum rounded-sm"
                                onChange={search}
                                placeholder="Search"
                            />
                        )}
                        <div className="max-h-60 overflow-y-scroll">
                            {!data.length ? (
                                "No items available"
                            ) : (
                                <ul>
                                    {options.length
                                        ? options.map((e, i) => (
                                            <li
                                                key={i}
                                                onClick={() => {
                                                    //@ts-ignore
                                                    onChange && onChange(e);
                                                    if (getValue) {
                                                        setValue(getValue(e));
                                                    } else {
                                                        setValue(e.value);
                                                        if(e.img) {
                                                            setImg(e.img);
                                                        }
                                                    }
                                                    setOpen(false);
                                                }}
                                                className="hover:bg-grey-cultured text-sm cursor-pointer active:bg-blue-shade active:text-white rounded-lg px-2 py-3 text-black flex justify-start items-center"
                                            >
                                                {e.img && <div className="mr-4">
                                                    <img 
                                                        src={e.img} 
                                                        alt={'League'} 
                                                        className="w-6 h-6"
                                                    />
                                                </div>}
                                                {e.label ? e.label : e.value}
                                                <span className="ml-2">({e.country && e.country})</span>
                                            </li>
                                        ))
                                        : "No results found"}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </ClickOutside>
    );
}
