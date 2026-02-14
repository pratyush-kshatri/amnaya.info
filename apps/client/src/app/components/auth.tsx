import { useCallback, useRef, useState } from "react";
import z, { ZodSchema } from "zod";

function AuthProps() {
    const [values, setValues] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [focussed, setFocussed] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);
    const submittedRef = useRef(false);

    const fieldValidate = useCallback((field: string, value: any, schema: ZodSchema | undefined) => {
        if (!schema) return;

        const shape = (schema as z.ZodObject<any>).shape;
        const fieldSchema = shape?.[field] as z.ZodTypeAny | undefined;
        if (!fieldSchema) return;

        const result = fieldSchema.safeParse(value);

        setErrors((prev) => {
            const next = { ...prev };
            if (result.success) delete next[field];
            else next[field] = result.error.issues[0]?.message ?? 'Invalid value';
            return next;
        });
    }, []);

    const handleFieldBlur = (field: string, currentSchema: ZodSchema) => {
        setFocussed((prev) => ({ ...prev, [field]: true }));
        fieldValidate(field, values[field], currentSchema);
    }

    const handleFieldChange = useCallback((field: string, value: any, currentSchema?: ZodSchema) => {
        setValues((prev) => ({ ...prev, [field]: value }));

        if (currentSchema && (focussed[field] || submittedRef.current)) {
            fieldValidate(field, value, currentSchema);
        }
    }, [fieldValidate, focussed]);

    const handleSubmit = async (
        schema: ZodSchema,
        callback: (data: any) => Promise<void>
    ) => {
        setIsLoading(true);
        submittedRef.current = true;
        setErrors({}); // Clear Errors

        try {
            // Validate Form
            const result = schema.safeParse(values);
            if (!result.success) {
                const fieldErrors: Record<string, string> = {};
                result.error.issues.forEach((issue) => {
                    if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
                });
                setErrors(fieldErrors);
                return;
            }

            const validData = result.data;
            await callback(validData);
        } catch (error) {
            // Surface any unexpected errors
            console.error('Auth submit failed', error);
        } finally {
            setIsLoading(false);
        }

        resetForm();
    };

    const resetForm = () => {
        setValues({});
        setErrors({});
        setFocussed({});
        submittedRef.current = false;
    };

    return {
        values,
        errors,
        isLoading,
        handleFieldChange,
        handleFieldBlur,
        handleSubmit,
        resetForm
    }
}

export { AuthProps };