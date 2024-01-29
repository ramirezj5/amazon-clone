import React, { useEffect, useState } from 'react';
import './Orders.css';
import Order from '../Order/Order';
import { db } from '../../firebase';
import { useStateValue } from '../../Services/StateProvider';
import { getDocs, orderBy, query, collection } from 'firebase/firestore';


export default function Orders() {
    const [{basket, user}, dispatch] = useStateValue();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if(user){
            const fetchData = async () => {
                const orders = collection(db,"users", user?.uid, 'orders');
                const orderedOrders = query(orders, orderBy('created', 'desc'));
                const querySnapshot = await getDocs(orderedOrders);
                setOrders(querySnapshot.docs.map(doc => ({
                             id:doc.id,
                         data:doc.data()
                })))
            }
            fetchData();
        } else{
            setOrders([]);
        }
    }, [user])


  return (
    <div className='orders'>
        <h1>Your Orders </h1>
        <div className='orders_order'>
            {orders?.map(order => (
                <Order order= {order}/>
            ))}
        </div>
    </div>
  )
}
