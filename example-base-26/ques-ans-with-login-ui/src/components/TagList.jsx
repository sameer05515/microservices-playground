function TagList({
    tags,
    onEdit,
    onDelete,
}) {

    if (!tags.length) {
        return (
            <div className="empty-state">

                <div className="empty-icon">
                    #
                </div>

                <h3>No Tags</h3>

                <p>
                    No tags have been added yet.
                </p>

            </div>
        );
    }

    return (
        <div className="tag-list">

            <div className="list-header">

                <h2>Tags</h2>

                <span>
                    {tags.length}
                </span>

            </div>

            <div className="tag-table-wrapper">

                <table className="tag-table">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tag</th>
                            <th>ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {tags.map((tag, index) => (
                            <tr key={tag.id}>

                                <td>
                                    {index + 1}
                                </td>

                                <td>
                                    <span className="tag-badge">
                                        {tag.name}
                                    </span>
                                </td>

                                <td className="tag-id">
                                    {tag.id}
                                </td>

                                <td>

                                    <div className="table-actions">

                                        <button
                                            type="button"
                                            className="edit-button"
                                            onClick={() =>
                                                onEdit(tag)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="danger-button"
                                            onClick={() =>
                                                onDelete(tag.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default TagList;