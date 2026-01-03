import { useEffect, useState } from "react";

import TagForm from "../components/TagForm";
import TagList from "../components/TagList";

import {
    getTags,
    createTag,
    updateTag,
    deleteTag,
} from "../services/tagService";

import "./QuestionsPage.css";

function TagsPage() {

    const [tags, setTags] = useState([]);

    const [selectedTag, setSelectedTag] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const loadTags = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getTags();

            setTags(data || []);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load tags."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTags();
    }, []);

    const handleAdd = () => {

        setSelectedTag(null);
        setIsModalOpen(true);
    };

    const handleEdit = (tag) => {

        setSelectedTag(tag);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {

        if (!loading) {
            setIsModalOpen(false);
            setSelectedTag(null);
        }
    };

    const handleSave = async (tag) => {

        try {

            if (selectedTag) {

                await updateTag(
                    selectedTag.id,
                    tag
                );

            } else {

                await createTag(tag);

            }

            setIsModalOpen(false);
            setSelectedTag(null);

            await loadTags();

        } catch (err) {

            console.error(err);

            throw err;
        }
    };

    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this tag?")) {
            return;
        }

        try {

            setLoading(true);

            await deleteTag(id);

            await loadTags();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete tag."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-header">

                <div>
                    <h2>Tag Management</h2>

                    <p>
                        Manage tags used to categorize questions.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={handleAdd}
                >
                    + Add Tag
                </button>

            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading && (
                <div className="loading">
                    Loading...
                </div>
            )}

            {!loading && (
                <TagList
                    tags={tags}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {isModalOpen && (
                <div
                    className="modal-overlay"
                    onClick={handleCloseModal}
                >

                    <div
                        className="modal tag-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <h2>
                                {selectedTag
                                    ? "Edit Tag"
                                    : "Add Tag"}
                            </h2>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={handleCloseModal}
                            >
                                ×
                            </button>

                        </div>

                        <div className="modal-body">

                            <TagForm
                                selectedTag={selectedTag}
                                onSave={handleSave}
                                onCancel={handleCloseModal}
                            />

                        </div>

                    </div>

                </div>
            )}

        </>
    );
}

export default TagsPage;