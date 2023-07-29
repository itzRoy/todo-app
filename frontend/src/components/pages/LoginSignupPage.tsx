import { ChangeEvent, FC, FormEventHandler, useEffect, useState } from 'react'
import PageWrapper from '../HOC/PageWrapper'
import LoginSignupForm from '../molecules/LoginSignupForm'
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
        }
    }, [dispatch, loginData, loginError])

    useEffect(() => {
        resetLogin()

        setValues(initialState)

        resetSignup()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignup])

    useEffect(() => {
        setTimeout(() => {
            resetLogin()

            resetSignup()
        }, 4000)

        return () =>
            clearTimeout(
                setTimeout(() => {
                    resetLogin()

                    resetSignup()
                }, 4000),
            )
    }, [resetLogin, resetSignup, loginError, signupError])

    useEffect(() => {
        if (!signupError && signupData) {
            setIsSignup(false)

            setValues(initialState)
        }
    }, [signupData, signupError])

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
        <div className='my-[0] mx-auto '>
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
        </div>
    )
}

const LoginSingup = PageWrapper(LoginPage, 'loginSignup')

export default LoginSingup
