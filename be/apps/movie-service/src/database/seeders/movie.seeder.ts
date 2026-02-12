import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Movie, AgeRating, MovieStatus } from '../../data-access/movie/movie.entity';
import { Genre } from '../../data-access/genre/genre.entity';
import { Person } from '../../data-access/person/person.entity';
import { MovieGenre } from '../../data-access/movie-genre/movie-genre.entity';
import { MovieDirector } from '../../data-access/movie-director/movie-director.entity';
import { MovieCast } from '../../data-access/movie-cast/movie-cast.entity';

  export class MovieSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const genresData = [
      'Biography', 'Drama', 'History', 'Action', 'Adventure', 'Sci-Fi', 'Crime', 'Thriller'
    ];

    const genreMap = new Map<string, Genre>();
    
    // Fetch existing genres
    const existingGenres = await em.find(Genre, {});
    existingGenres.forEach(g => genreMap.set(g.name, g));

    for (const name of genresData) {
      if (!genreMap.has(name)) {
        const genre = em.create(Genre, {
          name,
          slug: name.toLowerCase().replace(/ /g, '-'),
        });
        genreMap.set(name, genre);
      }
    }

    const moviesData = [
      {
        title: "OPPENHEIMER",
        description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        longDescription: "During World War II, Lt. Gen. Leslie Groves Jr. appoints physicist J. Robert Oppenheimer to work on the top-secret Manhattan Project. Oppenheimer and a team of scientists spend years developing and designing the atomic bomb. Their work comes to fruition on July 16, 1945, as they witness the world's first nuclear explosion, forever changing the course of history.",
        releaseDate: new Date("2023-07-21"),
        duration: 180,
        genre: ["Biography", "Drama", "History"],
        rating: 8.4,
        rottenTomatoes: 93,
        trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
        backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
        posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1",
        accentColor: "#f97316",
        status: MovieStatus.NOW_SHOWING,
        ageRating: AgeRating.C13,
        director: "Christopher Nolan",
        cast: [
          { name: "Cillian Murphy", role: "J. Robert Oppenheimer" },
          { name: "Emily Blunt", role: "Kitty Oppenheimer" },
          { name: "Matt Damon", role: "Leslie Groves" },
        ],
        stills: [
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1",
          "https://images.unsplash.com/photo-1536440136628-849c177e76a1"
        ]
      },
      {
        title: "DUNE: PART TWO",
        description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        longDescription: "Dune: Part Two will explore the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
        releaseDate: new Date("2024-03-01"),
        duration: 166,
        genre: ["Action", "Adventure", "Sci-Fi"],
        rating: 8.6,
        rottenTomatoes: 92,
        trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
        backdropUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877",
        posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
        accentColor: "#d97706",
        status: MovieStatus.NOW_SHOWING,
        ageRating: AgeRating.C13,
        director: "Denis Villeneuve",
        cast: [
          { name: "Timothée Chalamet", role: "Paul Atreides" },
          { name: "Zendaya", role: "Chani" },
        ],
        stills: [
          "https://images.unsplash.com/photo-1506466010722-395aa2bef877",
          "https://images.unsplash.com/photo-1534447677768-be436bb09401"
        ]
      }
    ];

    for (const mData of moviesData) {
      const existingMovie = await em.findOne(Movie, { title: mData.title });
      if (existingMovie) continue;

      const movie = em.create(Movie, {
        title: mData.title,
        description: mData.description,
        longDescription: mData.longDescription,
        releaseDate: mData.releaseDate,
        duration: mData.duration,
        rating: mData.rating,
        rottenTomatoes: mData.rottenTomatoes,
        trailerUrl: mData.trailerUrl,
        backdropUrl: mData.backdropUrl,
        posterUrl: mData.posterUrl,
        accentColor: mData.accentColor,
        status: mData.status,
        ageRating: mData.ageRating,
        stills: mData.stills,
      });

      // Add Genres
      for (const gName of mData.genre) {
        const genre = genreMap.get(gName);
        if (genre) {
          em.create(MovieGenre, { movie, genre });
        }
      }

      // Add Director
      const director = em.create(Person, { name: mData.director });
      em.create(MovieDirector, { movie, director });

      // Add Cast
      for (const cData of mData.cast) {
        const person = em.create(Person, { name: cData.name });
        em.create(MovieCast, { movie, person, roleName: cData.role });
      }
    }
    
    await em.flush();
  }
}
