import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from "./ProductItem";


const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        // Az összes termék logolása
        console.log("Termékek:", products);

        // Szűrés "true" értékre a bestseller mezőben
        const bestProduct = products.filter((item) => {
            console.log("Termék:", item);  // Minden termék logolása
            return item.bestSeller === true; 
        });

        console.log("Bestseller termékek:", bestProduct); // A megtalált bestseller termékek

        setBestSeller(bestProduct.slice(0, 5));  // Az első 5 bestseller termék
    }, [products]);

    return (
        <div className="my-10">
            <div className="text-center text-3xl py-8">
                <Title text2={"NÉPSZERŰEK"} />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat atque dolores suscipit quae, tempore eligendi eos dicta rem natus nesciunt impedit, commodi sunt dolorem corporis veniam obcaecati nihil. Excepturi, inventore!
                </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {
                    bestSeller.length > 0 ? (
                        bestSeller.map((item, index) => (
                            <ProductItem 
                                key={index} 
                                id={item._id} 
                                name={item.name} 
                                image={item.image} 
                                price={item.price} 
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-xl text-gray-500">
                            Nincs elérhető bestseller termék
                        </p>
                    )
                }
            </div>
        </div>
    );
};

export default BestSeller;
