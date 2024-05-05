import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import BasicTable from "../../components/basicTable/BasicTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setLightTheme } from "../../redux/themeSlice";
import { BASE_URL,BASE_OFFER_URL, HOST_NAME } from "../../utils/api";
import axios from "axios";
import { DateTime } from "luxon";
import { ToastContainer, toast } from "react-toastify";
import "./order.scss";
import Skeleton from "react-loading-skeleton";

const Order = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user);
    const [currentOrders, setCurrentOrders] = useState(null);

    useEffect(() => {
        dispatch(setLightTheme());
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(BASE_OFFER_URL + `/offers/${currentUser.user.id}`, {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });

                const tempOrders = response.data.data.map(order => {
                    return {
                        createdDate: order['createdAt'],
                        tokenId: order.token_id,
                        quantity: order.quantity,
                        price: order.at_price,
                        active: order.is_active ? "Active" : "Inactive",
                        status: order.is_finished ? "Completed" : "Incompleted",
                        type: order.is_buy ? "Buy" : "Sell",
                        delete: { orderId: order.id, isActive: order.is_active }
                    }
                });

                setCurrentOrders(tempOrders);
            } catch (err) {
                console.log(err);
            }
        };

        fetchOrders();
    }, [currentUser]);

    const handleCancelClick = async (e) => {
        const offerId = e.currentTarget.dataset.offer;

        try {
            await axios.get(BASE_OFFER_URL + `/offers/cancel/${offerId}`, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });

            toast.success('Cancel successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        } catch (err) {
            console.log(err);
            toast.error('Something went wrong!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };

    const columns = [
        {
            header: 'Created Date',
            accessorKey: 'createdDate',
            cell: (info) => {
                const inputDate = DateTime.fromJSDate(new Date(info.getValue()));
                const formattedDate = inputDate.toFormat('dd/LL/yyyy HH:mm:ss');
                return formattedDate;
            },
        },
        {
            header: 'Token ID',
            accessorKey: 'tokenId',
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity',
        },
        {
            header: 'Price',
            accessorKey: 'price',
        },
        {
            header: 'Active',
            accessorKey: 'active',
            cell: (info) => (
                <span style={{ color: info.getValue() === 'Active' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {info.getValue()}
                </span>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (info) => (
                <span style={{ color: info.getValue() === 'Completed' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {info.getValue()}
                </span>
            ),
        },
        {
            header: 'Type',
            accessorKey: 'type',
        },
        {
            header: 'Click to cancel',
            accessorKey: 'delete',
            cell: (info) => (
                <a className={`cancelBtn ${!info.getValue().isActive ? "disabled" : ""}`} data-offer={info.getValue().orderId} onClick={info.getValue().isActive && handleCancelClick}>
                    Cancel
                </a>
            )
        },
    ];

    return (
        <div className="order">
            <ContentWrapper>
                <BasicTable data={currentOrders || <Skeleton count={10} />} columns={columns} />
            </ContentWrapper>
            <ToastContainer />
        </div>
    );
}

export default Order;