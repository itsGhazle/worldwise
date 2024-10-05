import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
const BASE_URL = "http://localhost:9000/";
const cityContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "loaded/currentCity":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "cities/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("unknown action type");
  }
}
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}cities`);
        if (!res.ok) throw new Error("sth went wrong");
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "there was an error during fetching cities",
        });
      }
    }

    fetchCities();
  }, []);

  async function getCities(id) {
    if (Number(id) === currentCity.id) return;
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}cities/${id}`);
      const data = await res.json();
      dispatch({ type: "loaded/currentCity", payload: data });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "there was an error during fetching cities",
      });
    }
  }
  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-type": "application/json" },
      });
      const data = await res.json();
      dispatch({ type: "cities/created", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: "error fetching cities" });
    }
  }
  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}cities/${id}`, {
        method: "DELETE",
      });
      dispatch({
        type: "cities/deleted",
        payload: id,
      });
      // setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "there was an error deleting city",
      });
    }
  }
  return (
    <cityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCities,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </cityContext.Provider>
  );
}

function useCities() {
  const context = useContext(cityContext);
  if (context === undefined) throw new Error("error");
  return context;
}

export { CitiesProvider, useCities };
