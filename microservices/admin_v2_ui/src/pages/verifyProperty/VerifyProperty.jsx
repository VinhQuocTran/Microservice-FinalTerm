import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { BASE_URL } from "../../utils/api";
import BasicTable from "../../components/basicTable/BasicTable";
import './verifyProperty.scss';

const VerifyProperty = () => {
  const currentUser = useSelector(state => state.user);
  const [properties, setProperties] = useState([]);
  const [backgroundCheckServices, setBackgroundCheckServices] = useState([]);
  const [verifyPropertyId, setVerifyPropertyId] = useState(null);
  const verifyPropertyModalRef = useRef();
  const [isVerifyPropertyModalOpened, setIsVerifyPropertyModalOpened] = useState(false);
  const handleVerifyPropertyModalClick = (e) => {
    if (e.target.tagName === 'A') {
      setVerifyPropertyId(e.target.parentNode.parentNode.getElementsByTagName('td')[0].textContent);
    }
    verifyPropertyModalRef.current.style.visibility = !isVerifyPropertyModalOpened ? 'visible' : 'hidden';
    verifyPropertyModalRef.current.style.opacity = !isVerifyPropertyModalOpened ? 1 : 0;
    if (isVerifyPropertyModalOpened) e.stopPropagation();
    setIsVerifyPropertyModalOpened(prevState => !prevState);
  };
  const columns = [
    {
      header: 'Property ID',
      accessorKey: 'id',
    },
    {
      header: 'Verified Status',
      accessorKey: 'isVerified',
      cell: (info) => {
        return (
          <a style={{ color: info.getValue() === "0" ? "gray" : "green", fontWeight: "bold" }}>{info.getValue() === "0" ? "Pending" : "Active"}</a>
        );
      }
    },
    {
      header: 'Actions',
      accessorKey: '',
      cell: (info) => {
        return (
          <a className={`verifyPropertyBtn ${info.row.original.isVerified==="1" && "disabled"}`} onClick={handleVerifyPropertyModalClick}>Verify</a>
        );
      }
    }
  ];
  const handleVerifyPropertyFormSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    try {
      await axios.post(BASE_URL + `/properties/${verifyPropertyId}/verifyProperty`, Object.fromEntries(data), {
        headers: {
          Authorization: 'Bearer ' + currentUser.token
        }
      });

      verifyPropertyModalRef.current.style.visibility = !isVerifyPropertyModalOpened ? 'visible' : 'hidden';
      verifyPropertyModalRef.current.style.opacity = !isVerifyPropertyModalOpened ? 1 : 0;
      if (isVerifyPropertyModalOpened) e.stopPropagation();
      setIsVerifyPropertyModalOpened(prevState => !prevState);      
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(BASE_URL + `/properties?isVerified=0,1`);
        setProperties(response.data.data);
      } catch (err) {
        console.log(err);
      }
    }

    const fetchBackgroundCheckServices = async () => {
      try {
        const response = await axios.get(BASE_URL + `/services?service_type=ST01`);
        setBackgroundCheckServices(response.data.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProperties();
    fetchBackgroundCheckServices();
  }, []);

  return (
    <section className='verify-property-wrapper'>
      <div className='flexColCenter innerWidth paddings verify-property-container'>
        <BasicTable columns={columns} data={properties} />
      </div>

      <div className="verifyPropertyModal" style={{ visibility: "hidden" }} ref={verifyPropertyModalRef} onClick={handleVerifyPropertyModalClick}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleVerifyPropertyFormSubmit}>
            <div className="contentTop">
              <h1>Verify Property</h1>
              <IoMdClose onClick={handleVerifyPropertyModalClick} />
            </div>
            <div className="inputForm">
              <label htmlFor="backgroundCheckService">Background Check Service</label>
              <select name="serviceId" id="bcs">
                {backgroundCheckServices && backgroundCheckServices.map(item => {
                  return (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  );
                })}
              </select>
            </div>
            <div className="inputForm">
              <select name="result" id="status">
                <option value="-1">Failed</option>
                <option value="1">Passed</option>
              </select>
            </div>
            <div className="inputForm">
              <label htmlFor="note">Note</label>
              <input id="note" type="text" name="note" />
            </div>
            <div className="submitBtns">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default VerifyProperty;