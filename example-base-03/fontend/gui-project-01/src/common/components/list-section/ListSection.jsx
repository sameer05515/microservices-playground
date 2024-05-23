import React from 'react';
import { isNonEmptyArray } from '../../../utils/validation-utils';
import '../custom-card/Card.css';

const styles = {
    container: {
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "10px",
    },
    errorText: {
        color: "red",
    },
    boldText: {
        fontWeight: "bold",
    },
};

const ListSection = ({ title = '', items, renderItem, errorMessage }) => (
    <div className="card">

        {title && title.trim().length > 0 && <div className="card-header">
            <span style={styles.boldText}>{title}</span>
        </div>}

        <div className="card-body">
            <div className="card-field">
                {isNonEmptyArray(items) ? (
                    items.map(renderItem)
                ) : (
                    <span style={styles.errorText}>{errorMessage}</span>
                )}
            </div>
        </div>

    </div>
);

const renderListSection = (title, items, renderItem, errorMessage) => (
    <ListSection
        title={title}
        items={items}
        renderItem={renderItem}
        errorMessage={errorMessage}
    />
);

export default ListSection;
export {renderListSection};