import { useEffect, useState } from "react";

function TagForm({
    selectedTag,
    onSave,
    onCancel,
}) {

    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {

        if (selectedTag) {
            setName(selectedTag.name || "");
        } else {
            setName("");
        }

    }, [selectedTag]);

    const handleSubmit = async (event) => {

        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            alert("Tag name is required.");
            return;
        }

        try {

            setSaving(true);

            await onSave({
                name: trimmedName,
            });

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to save tag."
            );

        } finally {
            setSaving(false);
        }
    };

    return (
        <form
            className="question-form"
            onSubmit={handleSubmit}
        >

            <div className="form-group">

                <label htmlFor="tagName">
                    Tag Name
                </label>

                <input
                    id="tagName"
                    type="text"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    placeholder="Enter tag name"
                    disabled={saving}
                    autoFocus
                />

            </div>

            <div className="form-actions">

                <button
                    type="submit"
                    className="primary-button"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : selectedTag
                            ? "Update Tag"
                            : "Save Tag"}
                </button>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={onCancel}
                    disabled={saving}
                >
                    Cancel
                </button>

            </div>

        </form>
    );
}

export default TagForm;