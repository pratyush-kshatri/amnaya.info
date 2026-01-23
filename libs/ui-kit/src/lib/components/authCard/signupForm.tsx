import React, { useState } from "react";
import { Eye, EyeOff, KeyRound, LogIn, UserPlus, UserRound } from 'lucide-react';

import { SharedAuthCardProps, styles } from "./authCard";

import { Button } from '../button/button';

const SignupForm: React.FC<SharedAuthCardProps> = ({
    isLoading,
    values,
    onFieldChange,
    onFieldBlur,
    onSubmit,
    switchView
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <React.Fragment>

            <form
                className='flex flex-col gap-y-2'
                onSubmit={ onSubmit }
                key='signup-form'
            >
                {/* Username */}
                <div className='flex flex-row items-center gap-x-2'>
                    <UserRound className={ styles.icon } strokeWidth={ 2.5 } />
                    <input
                        className={ styles.input }
                        name='emailOrUsername'
                        value={ values.emailOrUsername || '' }
                        onChange={ (e) => onFieldChange('emailOrUsername', e.target.value) }
                        onBlur={ () => onFieldBlur?.('emailOrUsername') }
                        autoComplete='username email'
                        placeholder='Enter your Username/Email'
                        aria-label='Email or Username'
                        required
                    />
                </div>

                {/* Password */}
                <div className='flex flex-row items- gap-x-2'>
                    <KeyRound className={ styles.icon } strokeWidth={ 2.5 } />
                    <input
                        className={ styles.input }
                        name='password'
                        type={ showPassword ? 'text' : 'password' }
                        value={ values.password || '' }
                        onChange={ (e) => onFieldChange('password', e.target.value) }
                        onBlur={ () => onFieldBlur?.('password') }
                        autoComplete='current-password'
                        placeholder='Enter your password'
                        aria-label='Password'
                        required
                    />
                    <Button
                        className='form-right p-1 focus-visible:ring-accent'
                        variant='ghost'
                        onClick={ () => setShowPassword((s) => !s) }
                        aria-pressed={ showPassword }
                        icon={ showPassword ? <Eye className='w-5 h-5 text-accent' /> : <EyeOff className='w-5 h-5 text-accent' /> }
                    />
                </div>
            </form>

            {/* Seperator */}
            <div className={ styles.seperator } />

            <div className='form-button flex flex-row justify-between'>
                <Button
                    variant='primary'
                    loading={ isLoading }
                    icon={ <UserPlus className='w-5 h-5' />}
                    type='submit'
                >
                    Create Account
                </Button>
                <Button
                    variant='secondary'
                    icon={ <LogIn className='w-5 h-5' /> }
                    onClick={ () => switchView('login') }
                >
                    Back to Login
                </Button>
            </div>
        </React.Fragment>
    );
}

export { SignupForm };