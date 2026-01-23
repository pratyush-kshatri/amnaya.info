import React from "react";
import { LogIn, Mail, RotateCcwKey } from 'lucide-react';

import { SharedAuthCardProps, styles } from "./authCard";

import { Button } from '../button/button';

const ForgotPasswordForm: React.FC<SharedAuthCardProps> = ({
    isLoading,
    values,
    onFieldChange,
    onSubmit,
    switchView
}) => {
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
            <div className='flex flex-row items-center'>
                <Mail className={ styles.icon } strokeWidth={ 2.5 } />
                <input
                    className={ styles.input }
                    name='emailOrUsername'
                    value={ values.emailOrUsername || '' }
                    onChange={ (e) => onFieldChange('emailOrUsername', e.target.value) }
                    autoComplete='username email'
                    placeholder='Enter your Username/Email'
                    required
                />
            </div>

            <div className='form-button flex flex-row justify-between'>
                <Button
                    variant='primary'
                    loading={ isLoading }
                    icon={ <RotateCcwKey className='w-5 h-5' />}
                    type='submit'
                >
                    Reset Password
                </Button>
                <Button
                    variant='secondary'
                    icon={ <LogIn className='w-5 h-5' /> }
                    onClick={ () => switchView('login') }
                >
                    Back to Login
                </Button>
            </div>
        </form>
    );
}

export { ForgotPasswordForm };