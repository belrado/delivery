import { useState, useCallback } from 'react';

function useInput<T>(
    initialForm: T,
): [
    form: T,
    handleChange: (key: string, value: string) => void,
    reset: () => void,
] {
    const [form, setForm] = useState(initialForm);

    const handleChange = useCallback(
        (key: string, value: string) => {
            setForm({ ...form, [key]: value });
        },
        [form],
    );

    const reset = useCallback(() => {
        setForm(initialForm);
    }, [initialForm]);

    return [form, handleChange, reset];
}

export default useInput;
