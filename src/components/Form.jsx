// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useUrlPosition } from "../Hooks/useUrlPosition";
import { useCities } from "../Contexts/CitiesContext";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client?";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useUrlPosition();
  const [error, setError] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [emoji, setEmoji] = useState("");
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lat && !lng) return;
    async function fetchCitiesData() {
      try {
        setIsLoadingGeocoding(true);
        setError("");
        const res = await fetch(`${BASE_URL}latitude=${lat}&longitude=${lng}`);
        if (!res.ok) throw new Error("sth went wrong");
        const data = await res.json();
        console.log(data);
        if (!data.countryCode)
          throw new Error("that doesnt seem to be a city.click somewhere else");
        setCityName(data.city || data.locality || "");
        setCountry(data.country);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchCitiesData();
  }, [lat, lng]);
  // function handelAddCity(city) {
  //   const NewCity = { cityName };
  //   setCities((city) => [...cities, city]);
  // }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const NewCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await createCity(NewCity);
    navigate("/app")
  }
  if (isLoadingGeocoding) return <Spinner />;
  if (!lat && !lng)
    return <Message message="start by clicking somewhere on the map" />;

  if (error) return <Message message={error} />;
  return (
    <form
      className={`${styles.form}${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
