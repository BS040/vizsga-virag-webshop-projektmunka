import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PopUp from './PopUp';

const ManageUsers = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userIdToUpdate, setUserIdToUpdate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                toast.error('Hiba a felhasználók lekérésekor');
                console.error('Hiba a felhasználók lekérésekor:', error);
            }
        };

        fetchUsers();
    }, [token]);

    const handleUpdateStatus = async () => {
        if (!userIdToUpdate) return;

        try {
            const userToUpdate = users.find(user => user._id === userIdToUpdate);
            const updatedStatus = userToUpdate.status === 'active' ? 'inactive' : 'active';

            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${userIdToUpdate}/status`, { status: updatedStatus }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userIdToUpdate ? { ...user, status: updatedStatus } : user
                )
            );

            toast.success(updatedStatus === 'inactive' ? 'Felhasználó sikeresen inaktiválva!' : 'Felhasználó sikeresen visszaállítva!');
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Hiba az állapot frissítésekor');
            console.error('Hiba az állapot frissítésekor:', error);
        }
    };

    const openModal = (userId) => {
        setUserIdToUpdate(userId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setUserIdToUpdate(null);
    };



    return (
        <div className="container mx-auto p-4">
            <h1 className="mb-4 font-bold text-xl">Felhasználók ({users.length})</h1>
            <div className="mb-4 max-w-md mx-auto text-center">
                <label className="block mb-1 font-semibold">Keresés (név vagy email)</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pl. Kovács Anna vagy anna@email.hu"
                    className="w-full p-2 border rounded-none"
                />
            </div>
            <div className='flex flex-col gap-2'>
                {/* Fejléc */}
                <div className='grid grid-cols-[1fr_0.9fr_0.19fr] items-center py-2 px-3 border bg-gray-100 text-sm font-bold'>
                    <b>Név</b>
                    <b>Email</b>
                    <b>Művelet</b>
                </div>

                {/* Felhasználó lista */}
                {users.filter(user =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                    .map(user => (
                        <UserRow key={user._id} user={user} onUpdateStatus={openModal} />
                    ))}
            </div>

            {/* PopUp */}
            <PopUp
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleUpdateStatus}
                message={
                    users.find(user => user._id === userIdToUpdate)?.status === 'active'
                        ? 'Biztosan inaktiválod ezt a felhasználót?'
                        : 'Biztosan visszaállítod a felhasználót?'
                }
            />

        </div>
    );
};

const UserRow = ({ user, onUpdateStatus }) => {
    return (
        <div className="grid grid-cols-[1fr_1fr_0.25fr] items-center py-2 px-3 border text-sm">
            <p className="font-medium truncate">{user.name}</p>
            <p className="font-medium truncate">{user.email}</p>
            <button
                onClick={() => onUpdateStatus(user._id)}
                className={`px-3 py-2 transition ${user.status === 'inactive' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
            >
                {user.status === 'inactive' ? 'Visszaállítás' : 'Inaktiválás'}
            </button>
        </div>
    );
};

export default ManageUsers;
