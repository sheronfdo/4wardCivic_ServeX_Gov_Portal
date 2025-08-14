import React, { useEffect, useState,useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import NotificationModal from '../components/NotificationModal';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');
    const hasVerified = useRef(false);
    const [modalState, setModalState] = useState({
        isOpen: true,
        type: 'loading',
        message: 'Verifying your email...',
    });

    useEffect(() => {
        if (hasVerified.current) return;
        hasVerified.current = true;
        const verify = async () => {
            const token = searchParams.get('token');
            const type = searchParams.get('type'); // 'authority' or 'admin'

            if (!token || !type) {
                setModalState({
                    isOpen: true,
                    type: 'error',
                    message: 'Invalid verification link',
                });
                return;
            }

            try {
                const endpoint = type === 'authority' ? '/authority/verify-email' : '/authority/admin/verify-email';
                const res = await apiClient.get(`/auth${endpoint}?token=${token}`);
                setModalState({
                    isOpen: true,
                    type: 'success',
                    message: res.message || 'Email verified successfully. Redirecting...',
                });
                setTimeout(() => {
                    navigate(type === 'authority' ? '/authority-admin-registration' : '/login', {
                        state: type === 'authority' ? { authorityId: res.authority_id } : {},
                    });
                }, 3000);
            } catch (error) {
                setModalState({
                    isOpen: true,
                    type: 'error',
                    message: error.message || 'Verification failed',
                });
            }
        };

        verify();
    }, [searchParams, navigate]);

    const closeModal = () => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <NotificationModal
                isOpen={modalState.isOpen}
                type={modalState.type}
                message={modalState.message}
                onClose={closeModal}
            />
        </div>
    );
};

export default VerifyEmail;