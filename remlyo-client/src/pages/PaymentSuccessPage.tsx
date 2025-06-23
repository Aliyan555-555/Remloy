import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../components/common/LoadingSpinner';
import { reCheckInSuccess } from '../api/subscriptionApi';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';

const PaymentSuccessPage = () => {
    const [loading, setLoading] = useState(true);
    const { planId } = useParams();
    const { authToken } = useAuth();



    const checking = async () => {
        try {
            const res = await reCheckInSuccess(authToken, planId);
            console.log(res);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checking();
    }, [])

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className='min-h-screen min-w-screen flex items-center justify-center'>
            <div className='w-[90%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[20%]  !p-10 rounded-lg  flex flex-col items-center justify-center' style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>

                <img src="/images/payment-success.jpg" alt="Success" className='w-[100px] h-[100px] md:w-[120px] md:h-[120px] ' />
                <h2 className='text-black text-2xl mt-4'>Payment Successfully</h2>
                <div className='text-sm md:text-lg flex flex-col gap-2 text-gray-500 text-center mt-4'>
                    <p>You’ve successfully subscribed to the Premium Plan ($9.99/month).</p>
                    <p>We’ve emailed your receipt and plan details for your records.</p>
                    <p>You now have full access to personalized remedies and premium features.</p>

                </div>


            </div>

        </div>
    )
}

export default PaymentSuccessPage
