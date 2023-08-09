import { ChangeEvent, FC, FormEventHandler, useEffect, useState } from 'react'
import PageWrapper from '../HOC/PageWrapper'
import { LoginSignupForm } from '../molecules'
import { useLoginMutation, useSignupMutation } from '../../store/api/userApi'
import { storeToken } from '../../store/slice/userSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'

interface UserCredentials {
    email: string
    password: string
    confirmPassword: string
}

const initialState: UserCredentials = {
    email: '',
    password: '',
    confirmPassword: '',
}

const LoginPage: FC = () => {
    const [login, { isLoading: isLoginLoading, error: loginError, data: loginData, reset: resetLogin }] =
        useLoginMutation()
    const [signup, { isLoading: isSignupLoading, data: signupData, error: signupError, reset: resetSignup }] =
        useSignupMutation()
    const dispatch = useDispatch<AppDispatch>()
    const [isSignup, setIsSignup] = useState(false)
    const [values, setValues] = useState<UserCredentials>(initialState)

    useEffect(() => {
        if (!loginError && loginData) {
            dispatch(storeToken(loginData?.data?.access_token))

            setValues(initialState)

            resetLogin()
        }
    }, [dispatch, loginData, loginError, resetLogin])

    useEffect(() => {
        setValues(initialState)
    }, [isSignup])

    useEffect(() => {
        setTimeout(() => {
            if (!isLoginLoading && !isSignupLoading) {
                resetLogin()

                resetSignup()
            }
        }, 4000)

        return () =>
            clearTimeout(
                setTimeout(() => {
                    if (!isLoginLoading && !isSignupLoading) {
                        resetLogin()

                        resetSignup()
                    }
                }, 4000),
            )
    }, [resetLogin, resetSignup, loginError, signupError, isLoginLoading, isSignupLoading])

    useEffect(() => {
        if (!signupError && signupData) {
            resetSignup()

            setIsSignup(false)

            setValues(initialState)
        }
    }, [resetSignup, signupData, signupError])

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setValues((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const onSubmitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        if (!isSignup) {
            login({
                email: values.email,
                password: values.password,
            })
        } else {
            signup(values)
        }
    }

    return (
        <LoginSignupForm
            loginError={loginError}
            signupError={signupError}
            setIsSignup={setIsSignup}
            isSignup={isSignup}
            values={values}
            onInputChange={onInputChange}
            submit={onSubmitHandler}
            disabled={
                isLoginLoading ||
                isSignupLoading ||
                !values.email ||
                !values.password ||
                (isSignup && !values.confirmPassword)
            }
        />
    )
}

const LoginSingup = PageWrapper(LoginPage, 'loginSignup')

export default LoginSingup
