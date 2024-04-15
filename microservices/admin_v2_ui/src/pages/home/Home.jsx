import { useNavigate } from "react-router-dom";
import './home.scss';

const Home = () => {
  const navigate = useNavigate();

  return (
    <section className='home-wrapper'>
      <div className='flexColCenter innerWidth paddings home-container'>
        <div className='home-btn' onClick={() => navigate("/verify-property")}>
          Verify Property
        </div>
        <div className='home-btn' onClick={() => navigate("/list-property")}>
          List Property
        </div>
      </div>
    </section>
  )
}

export default Home