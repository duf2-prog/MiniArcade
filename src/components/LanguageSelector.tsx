import { Fragment, useContext } from "react";
import { LanguageContext } from "../contexts/LangContext"
import { Listbox, Transition } from "@headlessui/react";
import { FormattedMessage } from "react-intl";

type Locale = "es" | "en";

const LanguageSelector = ({ locale }: { locale: Locale }) => {
    const { changeLanguage } = useContext(LanguageContext);

    return (
        <Listbox value={locale} onChange={changeLanguage}>
            <div className="relative">
                <Listbox.Button className="lang-button">
                    {locale === "es"
                        ? <FormattedMessage id="navbar.spanish" />
                        : <FormattedMessage id="navbar.english" />}
                </Listbox.Button>

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="lang-options">
                        <Listbox.Option value="en" className="lang-option">
                            <FormattedMessage id="navbar.english" />
                        </Listbox.Option>

                        <Listbox.Option value="es" className="lang-option">
                            <FormattedMessage id="navbar.spanish" />
                        </Listbox.Option>
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};

export default LanguageSelector;