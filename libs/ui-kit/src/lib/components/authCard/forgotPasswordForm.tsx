import React from "react";
import { LogIn, Mail, RotateCcwKey } from 'lucide-react';

import { SharedAuthCardProps, styles } from "./sharedAuth";

import { Button } from '../button/button';

const ForgotPasswordForm: React.FC<SharedAuthCardProps> = ({
    isLoading,
    values,
    errors,
    onFieldChange,
    onFieldBlur,
    onSubmit,
    switchView
}) => {
    const error = errors?.emailOrUsername;

    return (
        <form
            className='flex flex-col gap-y-2'
            onSubmit={ onSubmit }
            key='forgot-password-form'
        >
            {/* Email */}
            <span className={ styles.label + ' text-center' }>
                Enter your Username/Email, we will verify our record and send you a link to reset your password
            </span>
            <div className='flex flex-row items-center gap-x-2'>
                <Mail className={ styles.icon } />
                <input
                    className={ styles.input }
                    name='emailOrUsername'
                    value={ values.emailOrUsername || '' }
                    onChange={ (e) => onFieldChange('emailOrUsername', e.target.value) }
                    onBlur={ () => onFieldBlur?.('emailOrUsername') }
                    autoComplete='username email'
                    placeholder='Enter your Username/Email'
                    aria-invalid={ !!error }
                    aria-describedby={ error ? 'auth-forgot-username-or-email-error' : undefined }
                />
            </div>

            <div className='form-button flex flex-row justify-between gap-x-2'>
                <Button
                    variant='secondary'
                    icon={ <LogIn className='w-5 h-5' /> }
                    type='button'
                    onClick={ () => switchView('login') }
                >
                    Login
                </Button>
                <Button
                    variant='primary'
                    loading={ isLoading }
                    icon={ <RotateCcwKey className='w-5 h-5' />}
                    type='submit'
                >
                    Reset
                </Button>
            </div>
        </form>
    );
}

export { ForgotPasswordForm };