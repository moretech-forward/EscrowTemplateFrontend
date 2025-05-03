import React from "react";
import clsx from "clsx";

const Peel = React.forwardRef(
    (
        {
            children,
            className = "",
            disabled = false,
            onClick,
            borderColor = "rgb(33,37,41)",
            backgroundColor = "#fff",
            textColor = "#212529",
            small = true,
            style = {},
            type = "button",
            ...rest
        },
        ref
    ) => {
        const borderImageSvg = `url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="${encodeURIComponent(
            borderColor
        )}" /></svg>')`;

        const baseClasses = clsx(
            "relative",
            "inline-block",
            "text-center",
            "align-middle",
            "select-none",
            "cursor-nes-pointer", // Кастомный курсор
            "transition-transform",
            "active:transform-nes-active", // Эффект нажатия
            disabled && "opacity-60 cursor-not-allowed",
            className
        );

        const sizeClasses = small ? "px-2 py-1 m-1" : "px-3 py-1.5 m-1.5";

        return (
            <button
                ref={ref}
                className={`${baseClasses} ${sizeClasses}`}
                style={{
                    borderImageSource: borderImageSvg,
                    borderImageSlice: 2,
                    borderImageWidth: 2,
                    borderImageOutset: 2,
                    borderImageRepeat: "stretch",
                    borderStyle: "solid",
                    color: textColor,
                    backgroundColor,
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    userSelect: "none",
                    ...style,
                }}
                onClick={onClick}
                disabled={disabled}
                type={type}
                {...rest}
            >
                {children}
            </button>
        );
    }
);

Peel.displayName = "Peel";

export default Peel;