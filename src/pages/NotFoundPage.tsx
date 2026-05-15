import { FormattedMessage } from "react-intl";

const NotFoundPage = () => {
    return (
        <div className="page-container">
            <h1 className="page-title">
                <FormattedMessage id="notFound.title" />
            </h1>
            <h2 className="page-subtitle">
                <FormattedMessage id="notFound.subtitle" />
            </h2>
            <button className="primary-button" onClick={() => window.history.back()}>
                <FormattedMessage id="notFound.goBack" />
            </button>
        </div>
    );
};

export default NotFoundPage;