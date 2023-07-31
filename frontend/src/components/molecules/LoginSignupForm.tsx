import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { ChangeEventHandler, FormEventHandler } from 'react'

interface UserCredentials {
    email: string
    password: string
    confirmPassword: string
}

type errorType = FetchBaseQueryError | SerializedError | undefined

interface IForm {
    submit: FormEventHandler<HTMLFormElement>
    onInputChange: ChangeEventHandler<HTMLInputElement>
    isSignup: boolean
    setIsSignup: (value: boolean | ((val: boolean) => boolean)) => void
    values: UserCredentials
    disabled: boolean
    signupError?: errorType
    loginError?: errorType
}

const LoginSignupForm = ({
    submit,
    isSignup,
    setIsSignup,
    onInputChange,
    values,
    disabled,
    loginError,
    signupError,
}: IForm) => {
    const toggleSignup = () => setIsSignup((prev) => !prev)

    return (
        <div className='flex flex-col items-center mx-auto mt-[40px] max-w-[500px]'>
            <h2 className='dark:text-white-text text-black dark:opacity-50 text-4xl block mb-20'>
                {!isSignup ? 'Login' : 'Register'}
            </h2>
            <form onSubmit={submit} className='flex flex-col  gap-12 min-w-auto w-full'>
                <input
                    type='email'
                    name='email'
                    value={values.email}
                    onChange={onInputChange}
                    placeholder='Email'
                    className='input'
                />
                <input
                    type='password'
                    name='password'
                    value={values.password}
                    onChange={onInputChange}
                    placeholder='Password'
                    className='input'
                />
                {isSignup ? (
                    <input
                        type='password'
                        name='confirmPassword'
                        value={values.confirmPassword}
                        onChange={onInputChange}
                        placeholder='Confirm Password'
                        className='input'
                    />
                ) : null}
                {loginError && 'data' in loginError ? (
                    <p className='dark:opacity-50 text-red-500'>
                        {(loginError?.data as { message: string }).message as string}
                    </p>
                ) : null}
                {signupError && 'data' in signupError ? (
                    <p className='dark:opacity-50 text-red-500'>
                        {(signupError?.data as { message: string }).message as string}
                    </p>
                ) : null}
                <p className='dark:opacity-50 dark:text-white-text text-text-black'>
                    {!isSignup ? 'Don’t have an account yet? ' : 'Already have an account? '}
                    <span onClick={toggleSignup} className='underline underline-offset-3 cursor-pointer'>
                        {!isSignup ? 'Signup' : 'Login'}
                    </span>
                </p>
                <button type='submit' disabled={disabled} className='button disabled:bg-light-input bg-check-box'>
                    {!isSignup ? 'Login' : 'Register'}
                </button>
            </form>
        </div>
    )
}

export default LoginSignupForm
