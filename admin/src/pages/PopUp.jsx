import React from 'react';

const PopUp = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 shadow-md">
                <h2 className="text-lg font-bold text-center">{message}</h2>
                <div className="flex justify-center mt-4 space-x-4"> {/* Középen a gombok */}
                    <button onClick={onClose} className="text-gray-600 border border-gray-300 px-4 py-2 hover:bg-gray-100">Mégse</button>
                    <button onClick={onConfirm} className="text-white bg-red-500 px-4 py-2 hover:bg-red-600">Igen</button>
                </div>
            </div>
        </div>
    );
};

export default PopUp;
