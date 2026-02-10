import { API_URL } from "../constans";
import Movie from "../components/movie";
import styles from "../../styles/home.module.css";

export const metadata = {
  title: "Home",
};
async function getMovies() {
  console.log("im fetching");
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch(API_URL);
  const json = await response.json();
  return json;
}

export default async function HomePage() {
  const movies = await getMovies();
  return (
    <div className={styles.container}>
      {movies.map((movie) => (
        <Movie
          key={movie.id}
          id={movie.id}
          poster_path={movie.poster_path}
          title={movie.title}
        />
      ))}
    </div>
  );
}
