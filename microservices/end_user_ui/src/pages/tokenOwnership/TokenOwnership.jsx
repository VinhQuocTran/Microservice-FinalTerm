import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { TokenCard } from "../../components/imports";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL, BASE_RENTAL_URL } from "../../utils/api";
import { setDarkTheme } from "../../redux/themeSlice";
import BasicTable from "../../components/basicTable/BasicTable";
import { toast, ToastContainer } from "react-toastify";
import { increaseCashBalance, updateUser } from "../../redux/userSlice";
import { DateTime } from "luxon";
import 'react-toastify/dist/ReactToastify.css';
import "./tokenOwnership.scss";
import Skeleton from "react-loading-skeleton";

const TokenOwnership = () => {
  const [tokenOwnership, setTokenOwnership] = useState(null);
  const [historyWithdraws, setHistoryWithdraws] = useState([]);
  const [totalCurrentEarned, setTotalCurrentEarned] = useState(0);
  const currentUser = useSelector(state => state.user);
  const appTheme = useSelector(state => state.theme);
  const dispatch = useDispatch();

  const columns = [
    {
      header: 'Withdraw ID',
      accessorKey: 'id',
    },
    {
      header: 'Amount',
      accessorKey: 'withdraw_amount',
      cell: (info) => Number(info.getValue()).toFixed(2)
    },
    {
      header: 'Date time',
      accessorKey: 'withdraw_date',
      cell: (info) => {
        const dateTime = DateTime.fromFormat(info.getValue(), 'ccc, dd LLL yyyy HH:mm:ss \'GMT\'');
        const formattedDateTime = dateTime.toFormat('dd/LL/yyyy HH:mm:ss');
        return formattedDateTime;
      }
    },
    {
      header: 'Type',
      accessorKey: 'withdraw_type_option',
    }
  ];
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

  const columns_tokenship = [
    { header: "ID", accessorKey: "id" },
    { header: "Own Number", accessorKey: "ownNumber" },
    { header: "Listing Property ID", accessorKey: "listingPropertyId" },
    { header: "Account ID", accessorKey: "accountId" },
    { header: "Created At", accessorKey: "createdAt" ,
    cell: (info) => {
      return formatDate(info.getValue());
    }
  },
];

  const handleWithdrawClick = async () => {
    try {
      await axios.get(BASE_RENTAL_URL + `/withdraw/${currentUser.user.id}/cash`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });

      let user = localStorage.getItem('user');
      user = JSON.parse(user);
      user.cashBalance += Number(totalCurrentEarned);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(increaseCashBalance(totalCurrentEarned));

      toast.success('Withdraw successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
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

  useEffect(() => {
    dispatch(setDarkTheme());
  }, []);

  useEffect(() => {
    const fetchTokenOwnership = async () => {
      try {
        const response = await axios.get(BASE_URL + `/propertyTokenOwnerships/getTokenOwnerships/${currentUser.user.id}`);
        setTokenOwnership(response.data.data.propertyTokenOwnership);
      } catch (err) {
        console.log(err);
      }
    }
    fetchTokenOwnership();
  }, [currentUser?.user]);

  useEffect(() => {
    const fetchHistoryWithdraw = async () => {
      try {
        const response = await axios.get(BASE_RENTAL_URL + `/withdraw/${currentUser.user.id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        console.log(response);
        setHistoryWithdraws(response.data.data);
        setTotalCurrentEarned(response.data.total_withdraw);
      } catch (err) {
        console.log(err);
      }
    }
    fetchHistoryWithdraw();
  }, [currentUser?.user]);

  return (
    <div className={`tokenOwnership ${appTheme.themeColor === 'dark' ? 'darkTheme' : ""}`}>
      <ContentWrapper>
        <div className="boxContainer">
          <h1 className="boxTitle">Withdraw History</h1>
          <div className="box">
            <div className="boxLeft">
              <h2>Current Rent Balance (USD)</h2>
              <span>${totalCurrentEarned}</span>
            </div>
            <div className="boxRight">
              <button type="button" onClick={handleWithdrawClick}>Withdraw</button>
            </div>
          </div>
          <div className="widthdrawHistoryList">
            <BasicTable data={historyWithdraws || <Skeleton count={10} />} columns={columns} />
          </div>
        </div>
        <div className="boxContainer">
          <h1 className="boxTitle">Token Ownership</h1>
          <div className="items">
            <BasicTable data={tokenOwnership || <Skeleton count={10} />} columns={columns_tokenship} />
          </div>
        </div>
      </ContentWrapper>
      <ToastContainer />
    </div>
  )
}

export default TokenOwnership