import React from "react";
import styles from "@/css/PixelInput.module.css";
import clsx from "clsx";

const PixelInput = React.forwardRef(
    (
        {
            value,
            onChange,
            placeholder = "",
            type = "text",
            className = "",
            disabled = false,
            name,
            id,
            autoFocus = false,
            required = false,
            style = {},
            borderColor = "black",
            ...rest
        },
        ref
    ) => {
        const borderImageSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M3 1h1v1h-1zM4 1h1v1h-1zM2 2h1v1h-1zM5 2h1v1h-1zM1 3h1v1h-1zM6 3h1v1h-1zM1 4h1v1h-1zM6 4h1v1h-1zM2 5h1v1h-1zM5 5h1v1h-1zM3 6h1v1h-1zM4 6h1v1h-1z' fill='${encodeURIComponent(
            borderColor
        )}'/%3E%3C/svg%3E")`;

        return (
            <div
                className={clsx(
                    styles.pixelContainer,
                    className,
                    "flex items-center justify-center"
                )}
                style={{
                    ...style,
                    "--input-custom-border": borderColor,
                    "--input-custom-border-image": borderImageSvg,
                }}
            >
                <input
                    ref={ref}
                    className={clsx(styles.pixelInput, "h-full")}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    name={name}
                    id={id}
                    autoFocus={autoFocus}
                    required={required}
                    {...rest}
                />
            </div>
        );
    }
);

PixelInput.displayName = "PixelInput";

export default PixelInput;