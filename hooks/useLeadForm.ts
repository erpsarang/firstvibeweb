
import React, { useState, useCallback } from 'react';
import type { LeadFormData, HiddenFormData, FullLeadData } from '../types';
import { analyticsService } from '../services/analyticsService';

const EMAIL_RE = /^(?:[a-zA-Z0-9_'^&/+=!?$%#`~.-]+)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

// Mock service to simulate API call
const submitLeadData = (data: FullLeadData): Promise<{ success: true }> => {
    console.log('[API Submission] Sending data:', data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate a random failure
            if (Math.random() < 0.1) {
                reject(new Error('A server error occurred. Please try again.'));
            } else {
                resolve({ success: true });
            }
        }, 1000);
    });
};

export const useLeadForm = () => {
    const [formData, setFormData] = useState<LeadFormData>({ name: '', email: '', consent: false });
    const [honeypot, setHoneypot] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
        if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.';
        if (!formData.email.trim()) {
            newErrors.email = '이메일을 입력해주세요.';
        } else if (!EMAIL_RE.test(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다.';
        }
        if (!formData.consent) newErrors.consent = '개인정보 수집 및 이용에 동의해주세요.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError(null);

        if (honeypot) {
            console.warn('Honeypot field filled. Blocking submission.');
            analyticsService.leadError('honeypot_flagged');
            return;
        }

        analyticsService.submitLead();

        if (!validate()) {
            analyticsService.leadError('validation_error');
            return;
        }

        const emailKey = `lead_submissions:${formData.email.toLowerCase().trim()}`;
        const submissionCount = (Number(localStorage.getItem(emailKey)) || 0) + 1;
        localStorage.setItem(emailKey, String(submissionCount));
        if (submissionCount >= 3) {
            console.warn(`[Warning] Same email submitted ${submissionCount} times.`);
            // You can show a toast or a subtle warning here.
        }

        setIsLoading(true);

        const params = new URLSearchParams(window.location.search);
        const hiddenData: HiddenFormData = {
            utm_source: params.get('utm_source') || '',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
            referrer: document.referrer || '',
            timestamp: new Date().toISOString(),
            page_path: window.location.pathname,
            user_agent: navigator.userAgent || '',
        };

        const fullData: FullLeadData = { ...formData, ...hiddenData };

        try {
            await submitLeadData(fullData);
            analyticsService.leadSuccess();
            setIsSubmitted(true);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setSubmitError(errorMessage);
            analyticsService.leadError('network_error');
        } finally {
            setIsLoading(false);
        }
    }, [formData, honeypot]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name as keyof LeadFormData]) {
             setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof LeadFormData];
                return newErrors;
            });
        }
    };
    
    const handleHoneypotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHoneypot(e.target.value);
    };

    return {
        formData,
        honeypot,
        errors,
        isLoading,
        isSubmitted,
        submitError,
        handleInputChange,
        handleHoneypotChange,
        handleSubmit
    };
};
