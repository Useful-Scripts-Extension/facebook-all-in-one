import React from "react";
import useStore, { selectors } from "../store";
import { Button } from "antd";
import { trackEvent } from "../utils/facebook";

export default function ThemeChanger() {
    const darkMode = useStore(selectors.darkMode);
    const setDarkMode = useStore(selectors.setDarkMode);

    const _setDarkMode = (darkMode: boolean) => {
        trackEvent("ThemeChanger:setDarkMode:" + darkMode);
        setDarkMode(darkMode);
    };

    return (
        <Button
            type="dashed"
            icon={
                darkMode ? (
                    <i className="fa-solid fa-sun"></i>
                ) : (
                    <i className="fa-solid fa-moon"></i>
                )
            }
            onClick={() => _setDarkMode(!darkMode)}
        />
    );
}
