import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Cake, Eye, EyeOff, Key, LogIn, Mail, RotateCcwKey, UserPlus, UserRound, VenusAndMars } from 'lucide-react';

import { SharedAuthCardProps, styles } from "./authCard";

import { Button } from '../button/button';

const SignupForm: React.FC<SharedAuthCardProps> = ({
    isLoading,
    values,
    onFieldChange,
    onFieldBlur,
    onSubmit,
    switchView,
    step = 1,
    onStepChange

}) => {
    const [showPassword, setShowPassword] = useState(false);

    const titles: Record<number, string> = {
        1: 'Personal Information',
        2: 'Account Details'
    };

    return (
        <React.Fragment>

            {/* Step Title */}
            <div className='form-title text-center font-semibold text-accent tracking-tight'>
                { titles[step] }
            </div>

            {/* Seperator */}
            <div className={ styles.seperator } />

            { step === 1 && (
                <div className='flex flex-col gap-y-2'>
                    {/* First Name */}
                    <input
                        className={ styles.input }
                        name='firstName'
                        value={ values.firstName || '' }
                        onChange={ (e) => onFieldChange('firstName', e.target.value) }
                        onBlur={ () => onFieldBlur?.('firstName') }
                        placeholder='First Name'
                        autoComplete='given-name'
                        aria-label='First Name'
                    />
                    {/* Last Name */}
                    <input
                        className={ styles.input }
                        name='lastName'
                        value={ values.lastName || '' }
                        onChange={ (e) => onFieldChange('lastName', e.target.value) }
                        onBlur={ () => onFieldBlur?.('lastName') }
                        placeholder='Last Name'
                        autoComplete='family-name'
                        aria-label='Last Name'
                    />
                    {/* DOB */}
                    <div className='flex flex-row items-center gap-x-2'>
                        <Cake className={ styles.icon } aria-hidden='true' />
                        <label className={ styles.label }>Date of Birth</label>
                        <div className='flex-1 flex justify-center'>
                        <input
                            className='form-input text-center border-b border-accent rounded-md px-4 py-2 outline-none placeholder:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent'
                            name='birthDate'
                            type='date'
                            value={ values.birthDate || '' }
                            onChange={ (e) => onFieldChange('birthDate', e.target.value) }
                            onBlur={ () => onFieldBlur?.('birthDate') }
                            autoComplete='bday'
                        />
                        </div>
                    </div>
                    {/* Gender */}
                    <div className='flex flex-row items-center gap-x-2'>
                        <VenusAndMars className={ styles.icon } aria-hidden='true' />
                        <label className={ styles.label }>Gender</label>
                        <div className='flex-1 flex justify-center'>
                        <select
                            className='form-input text-center border-b border-accent rounded-md px-4 py-2 outline-none placeholder:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent'
                            name='gender'
                            value={ values.gender || '' }
                            onChange={ (e) => onFieldChange('gender', e.target.value) }
                            autoComplete='sex'
                        >
                            <option value='' disabled>Select</option>
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                            <option value='other'>Other</option>
                        </select>
                        </div>
                    </div>
                </div>
            ) }

            { step === 2 && (
                <div className='flex flex-col gap-y-2'>
                    {/* Username */}
                    <div className='flex flex-row items-center gap-x-2'>
                        <UserRound className={ styles.icon } />
                        <input
                            className={ styles.input }
                            name='username'
                            value={ values.username || '' }
                            onChange={ (e) => onFieldChange('username', e.target.value) }
                            onBlur={ () => onFieldBlur?.('username') }
                            autoComplete='username'
                            placeholder='Enter your Username'
                        />
                    </div>
                    {/* Email */}
                    <div className='flex flex-row items-center gap-x-2'>
                        <Mail className={ styles.icon } />
                        <input
                            className={ styles.input }
                            name='email'
                            type='email'
                            value={ values.email || '' }
                            onChange={ (e) => onFieldChange('email', e.target.value) }
                            onBlur={ () => onFieldBlur?.('email') }
                            autoComplete='email'
                            placeholder='Enter your email'
                        />
                    </div>
                    {/* Password */}
                    <div className='flex flex-row items-center gap-x-2'>
                        <Key className={ styles.icon } />
                        <input
                            className={ styles.input }
                            name='password'
                            type={ showPassword ? 'text' : 'password' }
                            value={ values.password || '' }
                            onChange={ (e) => onFieldChange('password', e.target.value) }
                            onBlur={ () => onFieldBlur?.('password') }
                            autoComplete='new-password'
                            placeholder='Enter your password'
                            aria-label='Password'
                        />
                        <Button
                            className='form-right p-1 focus-visible:ring-accent'
                            variant='ghost'
                            onClick={ () => setShowPassword((s) => !s) }
                            aria-pressed={ showPassword }
                            icon={ showPassword ? <Eye className='w-5 h-5 text-accent' /> : <EyeOff className='w-5 h-5 text-accent' /> }
                        />
                    </div>
                    {/* Confirm Password */}
                    <div className='flex flex-row items-center gap-x-2'>
                        <RotateCcwKey className={ styles.icon } />
                        <input
                            className={ styles.input }
                            name='confirmPassword'
                            type='password'
                            value={ values.confirmPassword || '' }
                            onChange={ (e) => onFieldChange('confirmPassword', e.target.value) }
                            onBlur={ () => onFieldBlur?.('confirmPassword') }
                            placeholder='Confirm your password'
                            aria-label='Confirm Password'
                        />
                    </div>
                </div>
            ) }

            {/* Seperator */}
            <div className={ styles.seperator } />

            <div className='form-button flex flex-row justify-between gap-x-2'>
                { step < 2 ? (
                    <React.Fragment>
                        <Button
                            variant='secondary'
                            icon={ <LogIn className='w-5 h-5' /> }
                            type='button'
                            onClick={ () => switchView('login') }
                        >
                            LogIn
                        </Button>
                        <Button
                            variant='primary'
                            loading={ isLoading }
                            icon={ <ArrowRight className='w-5 h-5' />}
                            type='button'
                            onClick={ () => onStepChange?.(2) }
                        >
                            Next
                        </Button>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Button
                            variant='secondary'
                            icon={ <ArrowLeft className='w-5 h-5' /> }
                            type='button'
                            onClick={ () => onStepChange?.(1) }
                        >
                            Back 
                        </Button>
                        <Button
                            variant='primary'
                            loading={ isLoading }
                            icon={ <UserPlus className='w-5 h-5' />}
                            type='submit'
                        >
                            Create
                        </Button>
                    </React.Fragment>
                ) }
            </div>
        </React.Fragment>
    );
}

export { SignupForm };