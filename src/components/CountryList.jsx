import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import PropTypes from "prop-types"
import { useCities } from "../Contexts/CitiesContext";

CountryList.propTypes= {
cities:PropTypes.array,
isLoading:PropTypes.bool
}

function CountryList() {
    const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message={"add your first city by clicking on the map"} />;

  const countries = cities.reduce((acc, curr) => {
    if (!acc.map((el) => el.country).includes(curr.country))
      return([...acc, { country: curr.country, emoji: curr.emoji }]);
    else {
      console.log(acc);
    }
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((country, index) => (
        <CountryItem country={country} key={index} />
      ))}
    </ul>
  );
}

export default CountryList;
