import React, { useState } from "react";
import { Chrome, Eye, EyeOff, Github, Key, LogIn, UserPlus, UserRound } from 'lucide-react';

import { SharedAuthCardProps, styles } from "./sharedAuth";

import { Button } from '../button/button';

interface LoginFormProps extends SharedAuthCardProps {
    onOAuth?: (provider: 'google' | 'github') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    isLoading,
    values,
    errors,
    onFieldChange,
    onFieldBlur,
    onSubmit,
    switchView,
    onOAuth
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const emailError = errors?.emailOrUsername;
    const passwordError = errors?.password;

    return (
        <React.Fragment>

            <form
                className='flex flex-col gap-y-2'
                onSubmit={ onSubmit }
                key='login-form'
            >
                {/* Username */}
                <div className='flex flex-row items-center gap-x-4'>
                    <UserRound className={ styles.icon } />
                    <input
                        className={ styles.input }
                        name='emailOrUsername'
                        value={ values.emailOrUsername || '' }
                        onChange={ (e) => onFieldChange('emailOrUsername', e.target.value) }
                        onBlur={ () => onFieldBlur?.('emailOrUsername') }
                        autoComplete='username email'
                        placeholder='Enter your Username/Email'
                        aria-label='Email or Username'
                        aria-invalid={ !!emailError }
                        aria-describedby={ emailError ? 'auth-login-email-or-username-error' : undefined }
                    />
                </div>

                {/* Password */}
                <div className='flex flex-row items-center gap-x-4'>
                    <Key className={ styles.icon } />
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
                        aria-invalid={ !!passwordError }
                        aria-describedby={ passwordError ? 'auth-login-password-error' : undefined }
                    />
                    <Button
                        className='form-right p-1 focus-visible:ring-accent'
                        variant='ghost'
                        type='button'
                        onClick={ () => setShowPassword((s) => !s) }
                        aria-pressed={ showPassword }
                        icon={ showPassword ? <Eye className='w-5 h-5 text-accent' /> : <EyeOff className='w-5 h-5 text-accent' /> }
                    />
                </div>
                <div className='flex flex-row items-center justify-between'>
                    <div className='form-left'>
                        <Button
                            className={ styles.label + ' p-1 cursor-pointer' }
                            variant='ghost'
                            type='button'
                            onClick={ () => switchView('forgotPassword') }
                        >
                            Forgot Password?
                        </Button>
                    </div>
                    <div className='form-right flex flex-row'>
                        <span className={ styles.label }>Remember Me?</span>
                        <input
                            className='w-4 h-4 appearance-none rounded-full border border-accent bg-transparent cursor-pointer'
                            type='checkbox'
                            checked={ values.rememberMe || false }
                            onChange={ (e) => onFieldChange('rememberMe', e.target.checked) }
                        />
                    </div>
                </div>

                <div className='form-button flex flex-row justify-center gap-x-2'>
                    <Button
                        variant='secondary'
                        icon={ <UserPlus className='w-5 h-5' /> }
                        type='button'
                        onClick={ () => switchView('signup') }
                    >
                        Sign Up
                    </Button>
                    <Button
                        variant='primary'
                        loading={ isLoading }
                        icon={ <LogIn className='w-5 h-5' />}
                        type='submit'
                    >
                        Login
                    </Button>
                </div>
            </form>

            {/* Seperator */}
            <div className={ styles.seperator } />

            {/* O Auth */}
            <div className='flex flex-col items-center'>
                <span className={ 'form-label ' + styles.label }>
                    Or, continue with
                </span>
                <div className='form-button flex flex-row gap-x-2 mt-2'>
                    <Button
                        variant='accent'
                        icon={ <Chrome className='w-5 h-5' /> }
                        onClick={ () => onOAuth?.('google')}
                    >
                        Google
                    </Button>
                    <Button
                        variant='accent'
                        icon={ <Github className='w-5 h-5' />}
                        onClick={ () => onOAuth?.('github') }
                    >
                        GitHub
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
}

export { LoginForm, type LoginFormProps };
