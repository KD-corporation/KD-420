/**
 * logic for otp varifiation page
 * 1. simple take the otp from user
 * 2. send the otp and current user email(get email from params) to the backend for verification
 * 3. handle the response from the backend
 * 4. if success redirect to the dashboard
 * 5. if failure show the error message
 */

"use client"
import React from 'react';
import { useEffect } from 'react';

const OtpVerificationPage = () => {
    const [email, setEmail] = React.useState<string | null>(null);
    const [otp, setOtp] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        console.log("URL Params:", params.toString());
        const userEmail = params.get('email');
        // const userEmail = "kuldeep8410mtr@gmail.com";
        setEmail(userEmail);
    }, []);

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            alert("Email is missing");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${BaseUrl}/api/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("OTP verified successfully!");
                window.location.href = '/auth/login';
            } else {
                alert(data.message || "OTP verification failed");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert("An error occurred while verifying OTP");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <style jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    padding: 20px;
                }

                .card {
                    background: white;
                    border-radius: 20px;
                    padding: 50px 40px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    max-width: 440px;
                    width: 100%;
                    animation: slideUp 0.5s ease-out;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .icon-wrapper {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 30px;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 0 0 15px rgba(102, 126, 234, 0);
                    }
                }

                .icon {
                    width: 40px;
                    height: 40px;
                    stroke: white;
                    stroke-width: 2;
                    fill: none;
                }

                .title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #2d3748;
                    text-align: center;
                    margin-bottom: 12px;
                }

                .subtitle {
                    font-size: 15px;
                    color: #718096;
                    text-align: center;
                    margin-bottom: 8px;
                }

                .email-display {
                    font-size: 15px;
                    color: #667eea;
                    text-align: center;
                    font-weight: 600;
                    margin-bottom: 40px;
                }

                .form {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #4a5568;
                    text-align: center;
                }

                .input {
                    width: 100%;
                    padding: 18px;
                    font-size: 24px;
                    letter-spacing: 8px;
                    text-align: center;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    outline: none;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    color: #2d3748;
                }

                .input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
                }

                .input::placeholder {
                    letter-spacing: normal;
                    font-size: 16px;
                    color: #cbd5e0;
                }

                .button {
                    padding: 16px;
                    font-size: 16px;
                    font-weight: 600;
                    color: white;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }

                .button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
                }

                .button:active:not(:disabled) {
                    transform: translateY(0);
                }

                .button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .resend-text {
                    text-align: center;
                    font-size: 14px;
                    color: #718096;
                    margin-top: 20px;
                }

                .resend-link {
                    color: #667eea;
                    font-weight: 600;
                    text-decoration: none;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }

                .resend-link:hover {
                    color: #764ba2;
                    text-decoration: underline;
                }

                @media (max-width: 480px) {
                    .card {
                        padding: 40px 30px;
                    }

                    .title {
                        font-size: 24px;
                    }

                    .input {
                        font-size: 20px;
                        letter-spacing: 6px;
                    }
                }
            `}</style>

            <div className="container">
                <div className="card">
                    <div className="icon-wrapper">
                        <svg className="icon" viewBox="0 0 24 24">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <h1 className="title">Verify Your Email</h1>
                    <p className="subtitle">We've sent a 6-digit code to</p>
                    <p className="email-display">{email || 'your email'}</p>

                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="label" htmlFor="otp">Enter Verification Code</label>
                            <input
                                id="otp"
                                className="input"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={otp}
                                onChange={handleOtpChange}
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>

                        <button
                            className="button"
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                        >
                            {isLoading ? 'Verifying...' : 'Verify Code'}
                        </button>
                    </form>

                    <p className="resend-text">
                        Didn't receive the code?{' '}
                        <a className="resend-link">Resend Code</a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default OtpVerificationPage;