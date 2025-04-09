import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {
    const { symbol, delivery_fee, getCartAmount } = useContext(ShopContext);

    const cartAmount = getCartAmount(); // Kosár összegének meghatározása

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={"KOSÁR "} text2={"ÉRTÉKE"} />
            </div>

            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Rendelés összege: </p>
                    <p className='ml-1'>{cartAmount}.00 {symbol}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Szállítás:</p>
                    <p className='ml-1'>{delivery_fee}.00 {symbol}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <b>Összesen: </b>
                    <b className='ml-1'>{cartAmount === 0 ? 0 : cartAmount + delivery_fee}.00 {symbol}</b>
                </div>
            </div>
        </div>
    )
}

export default CartTotal