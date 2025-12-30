import React from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <button className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-lg w-full max-w-md mx-4 shadow-lg overflow-auto max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-medium">{title}</h3>
                    <button aria-label="Close" className="text-gray-600 hover:text-gray-900" onClick={onClose}>✕</button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
