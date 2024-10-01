import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import Message from "./Message"
function CityList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;
  if(!cities.length) return <Message message={"add your first city by clicking on the map"}/>
  return (
    <ul className={styles.cityList}>
      {cities.map((city, index) => {
        return <CityItem city={city} key={index} />;
      })}
    </ul>
  );
}

export default CityList;
