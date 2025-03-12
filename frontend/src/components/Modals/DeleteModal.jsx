import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const DeleteModal = ({
  isOpen,
  onClose,
  onDelete,
  title,
  description,
  deleteButtonLabel = "Delete",
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
      >
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h3
              id="delete-modal-title"
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
            >
              {title}
            </h3>
            <p
              id="delete-modal-description"
              className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              {description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {deleteButtonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};



export default DeleteModal;