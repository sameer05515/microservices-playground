import React from "react";
import "./Card.css";
import { camelCaseToTitleCase } from "../../../utils/helper-utils";
import { renderListSection } from "../list-section/ListSection";

const FieldValueType = {
    SingleValue: "single-value",
    ArrayValue: "array-value",
};

// Default renderer for individual items
const defaultItemRenderer = (item) => {
    if (!item) return <span>N/A</span>;
    if (typeof item === "object") {
        return (
            <div title="Please provide custom renderer">
                {renderCard({ objectToBeRendered: item })}
            </div>
        );
    }
    return item;
};

// Merged Field component to handle both single and array values
const Field = ({ label, value, renderItem = defaultItemRenderer }) => (
    <div className="card-field">
        <strong>{label}:</strong>{" "}
        {Array.isArray(value)
            ? renderListSection(
                null,
                value,
                (item, idx) =>
                    typeof item === "object" ? (
                        renderItem(item)
                    ) : (
                        <div key={idx}>- {item}</div>
                    ),
                "No items to display in the array"
            )
            : renderItem(value)}
    </div>
);

const Card = ({ title, fields = [] }) => (
    <div className="card">
        {title && (
            <div className="card-header">
                <span>{title}</span>
            </div>
        )}
        <div className="card-body">
            {fields.length > 0 ? (
                fields.map(({ label, value, renderItem }, idx) => (
                    <Field
                        key={idx}
                        label={label}
                        value={value}
                        renderItem={renderItem}
                    />
                ))
            ) : (
                <span>No fields provided</span>
            )}
        </div>
    </div>
);

const renderCard = ({ title, objectToBeRendered }) => {
    if (!objectToBeRendered || typeof objectToBeRendered !== "object") {
        return <span>Invalid object provided for rendering into a card</span>;
    }

    if (Array.isArray(objectToBeRendered)) {
        return renderListSection(
            title,
            objectToBeRendered,
            (item, idx) =>
                typeof item === "object" ? (
                    renderCard({ objectToBeRendered: item })
                ) : (
                    <div key={idx}>- {item}</div>
                ),
            "No items to display in the array"
        );
    }

    // Render object fields
    const fields = Object.keys(objectToBeRendered).map((key) => ({
        label: camelCaseToTitleCase(key),
        value: objectToBeRendered[key],
    }));

    return <Card title={title} fields={fields} />;
};

export default Card;
export { FieldValueType, renderCard };
