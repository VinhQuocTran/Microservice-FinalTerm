import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { BASE_URL } from "../../utils/api";
import BasicTable from "../../components/basicTable/BasicTable";
import './listProperty.scss';

const ListProperty = () => {
  const currentUser = useSelector(state => state.user);
  const [properties, setProperties] = useState([]);
  const [propertyManagers, setPropertyManagers] = useState([]);
  const [listPropertyId, setListPropertyId] = useState(null);
  const listPropertyModalRef = useRef();
  const [isListPropertyModalOpened, setIsListPropertyModalOpened] = useState(false);
  const handleListPropertyModalClick = (e) => {
    if (e.target.tagName === 'A') {
      setListPropertyId(e.target.parentNode.parentNode.getElementsByTagName('td')[0].textContent);
    }
    listPropertyModalRef.current.style.visibility = !isListPropertyModalOpened ? 'visible' : 'hidden';
    listPropertyModalRef.current.style.opacity = !isListPropertyModalOpened ? 1 : 0;
    if (isListPropertyModalOpened) e.stopPropagation();
    setIsListPropertyModalOpened(prevState => !prevState);
  };
  const columns = [
    {
      header: 'Property ID',
      accessorKey: 'id',
    },
    {
      header: 'List Status',
      accessorKey: 'isListed',
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
          <a className={`listPropertyBtn ${info.row.original.isListed==="1" && "disabled"}`} onClick={handleListPropertyModalClick}>List</a>
        );
      }
    }
  ];
  const handleListPropertyFormSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    try {
      await axios.post(BASE_URL + `/properties/${listPropertyId}/listProperty`, Object.fromEntries(data), {
        headers: {
          Authorization: 'Bearer ' + currentUser.token
        }
      });

      listPropertyModalRef.current.style.visibility = !isListPropertyModalOpened ? 'visible' : 'hidden';
      listPropertyModalRef.current.style.opacity = !isListPropertyModalOpened ? 1 : 0;
      if (isListPropertyModalOpened) e.stopPropagation();
      setIsListPropertyModalOpened(prevState => !prevState);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(BASE_URL + `/properties?isListed=0,1`);
        setProperties(response.data.data);
      } catch (err) {
        console.log(err);
      }
    }

    const fetchPropertyManagers = async () => {
      try {
        const response = await axios.get(BASE_URL + `/services?service_type=ST03`);
        setPropertyManagers(response.data.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProperties();
    fetchPropertyManagers();
  }, []);

  return (
    <section className='list-property-wrapper'>
      <div className='flexColCenter innerWidth paddings list-property-container'>
        <BasicTable columns={columns} data={properties} />
      </div>

      <div className="listPropertyModal" style={{ visibility: "hidden" }} ref={listPropertyModalRef} onClick={handleListPropertyModalClick}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleListPropertyFormSubmit}>
            <div className="contentTop">
              <h1>List Property</h1>
              <IoMdClose onClick={handleListPropertyModalClick} />
            </div>
            <div className="inputForm">
              <label htmlFor="propertyManagers">Property Manager</label>
              <select name="serviceId" id="propertyManagers">
                {propertyManagers && propertyManagers.map(item => {
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
            <div className="inputForm">
              <label htmlFor="propertyValuation">Property Valuation</label>
              <input id="propertyValuation" type="number" min={1} name="propertyValuation" />
            </div>
            <div className="inputForm">
              <label htmlFor="monthlyRent">Monthly Rent</label>
              <input id="monthlyRent" type="number" min={1} name="monthlyRent" />
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

export default ListProperty;