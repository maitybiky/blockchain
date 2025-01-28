import "./index.css";
import { MdHomeMax } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { BiNetworkChart } from "react-icons/bi";


const NavBar = () => {
  return (
    <div className="nav_container">
      <div className="button-container">
        <button className="button">
          <BiNetworkChart size={25}/>
        </button>
        <button className="button">
          <MdHomeMax size={25} />
        </button>
        <button className="button">
          <FaWallet size={25} />
        </button>
      </div>
    </div>
  );
};

export default NavBar;
