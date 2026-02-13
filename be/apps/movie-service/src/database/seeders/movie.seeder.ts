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
      'Biography', 'Drama', 'History', 'Action', 'Adventure', 'Sci-Fi', 'Crime', 'Thriller', 'Animation', 'Comedy', 'Family'
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
        previewVideoUrl: "https://vibezo-assets.s3.ap-southeast-1.amazonaws.com/oppenheimer-preview.mp4",
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
        previewVideoUrl: "https://vibezo-assets.s3.ap-southeast-1.amazonaws.com/dune-preview.mp4",
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
      },
      {
        title: "SPIDER-MAN: ACROSS THE SPIDER-VERSE",
        description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
        longDescription: "Miles Morales returns for the next chapter of the Oscar-winning Spider-Verse saga, an epic adventure that will transport Brooklyn’s full-time, friendly neighborhood Spider-Man across the Multiverse to join forces with Gwen Stacy and a new team of Spider-People to face off with a villain more powerful than anything they have ever encountered.",
        releaseDate: new Date("2023-06-02"),
        duration: 140,
        genre: ["Animation", "Action", "Adventure"],
        rating: 8.7,
        rottenTomatoes: 95,
        trailerUrl: "https://www.youtube.com/embed/shW9i6k8cB0",
        previewVideoUrl: "https://vibezo-assets.s3.ap-southeast-1.amazonaws.com/spiderman-preview.mp4",
        backdropUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820",
        posterUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe",
        accentColor: "#e11d48",
        status: MovieStatus.NOW_SHOWING,
        ageRating: AgeRating.P,
        director: "Joaquim Dos Santos",
        cast: [
          { name: "Shameik Moore", role: "Miles Morales" },
          { name: "Hailee Steinfeld", role: "Gwen Stacy" },
        ],
        stills: []
      },
      {
        title: "THE BATMAN",
        description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
        longDescription: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues. As the evidence begins to lead closer to home and the scale of the perpetrator's plans becomes clear, he must forge new relationships, unmask the culprit and bring justice to the abuse of power and corruption that has long plagued the metropolis.",
        releaseDate: new Date("2022-03-04"),
        duration: 176,
        genre: ["Action", "Crime", "Drama"],
        rating: 7.8,
        rottenTomatoes: 85,
        trailerUrl: "https://www.youtube.com/embed/mqqft2x_Aa4",
        previewVideoUrl: "https://vibezo-assets.s3.ap-southeast-1.amazonaws.com/batman-preview.mp4",
        backdropUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c",
        posterUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3",
        accentColor: "#1e293b",
        status: MovieStatus.NOW_SHOWING,
        ageRating: AgeRating.C16,
        director: "Matt Reeves",
        cast: [
          { name: "Robert Pattinson", role: "Bruce Wayne" },
          { name: "Zoë Kravitz", role: "Selina Kyle" },
        ],
        stills: []
      },
      {
        title: "INTERSTELLAR",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        longDescription: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, through a new wormhole to find a new planet for humans.",
        releaseDate: new Date("2014-11-07"),
        duration: 169,
        genre: ["Adventure", "Drama", "Sci-Fi"],
        rating: 8.7,
        rottenTomatoes: 73,
        trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
        previewVideoUrl: "https://vibezo-assets.s3.ap-southeast-1.amazonaws.com/interstellar-preview.mp4",
        backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
        posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
        accentColor: "#0ea5e9",
        status: MovieStatus.NOW_SHOWING,
        ageRating: AgeRating.P,
        director: "Christopher Nolan",
        cast: [
          { name: "Matthew McConaughey", role: "Cooper" },
          { name: "Anne Hathaway", role: "Brand" },
        ],
        stills: []
      },
      {
        title: "AVATAR: THE WAY OF WATER",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
        longDescription: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
        releaseDate: new Date("2022-12-16"),
        duration: 192,
        genre: ["Action", "Adventure", "Sci-Fi"],
        rating: 7.6,
        rottenTomatoes: 76,
        trailerUrl: "https://www.youtube.com/embed/d9MyW72ELq0",
        previewVideoUrl: "https://vibezo-assets.s3.ap-southeast-1.amazonaws.com/avatar-preview.mp4",
        backdropUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877",
        posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26",
        accentColor: "#06b6d4",
        status: MovieStatus.COMING_SOON,
        ageRating: AgeRating.P,
        director: "James Cameron",
        cast: [
          { name: "Sam Worthington", role: "Jake Sully" },
          { name: "Zoe Saldana", role: "Neytiri" },
        ],
        stills: []
      }
    ];

    for (const mData of moviesData) {
      let movie = await em.findOne(Movie, { title: mData.title });
      
      if (!movie) {
        movie = em.create(Movie, {
          title: mData.title,
          description: mData.description,
          longDescription: mData.longDescription,
          releaseDate: mData.releaseDate,
          duration: mData.duration,
          rating: mData.rating,
          rottenTomatoes: mData.rottenTomatoes,
          trailerUrl: mData.trailerUrl,
          previewVideoUrl: mData.previewVideoUrl,
          backdropUrl: mData.backdropUrl,
          posterUrl: mData.posterUrl,
          accentColor: mData.accentColor,
          status: mData.status,
          ageRating: mData.ageRating,
          stills: mData.stills || [],
        });
      } else {
        // Update existing movie with preview video url
        Object.assign(movie, {
          previewVideoUrl: mData.previewVideoUrl,
          accentColor: mData.accentColor,
          status: mData.status,
          duration: mData.duration,
          rating: mData.rating,
        });
      }

      // Add/Update Genres
      for (const gName of mData.genre) {
        const genre = genreMap.get(gName);
        if (genre) {
          const existingMg = await em.findOne(MovieGenre, { movie: movie.id, genre: genre.id });
          if (!existingMg) {
            em.create(MovieGenre, { movie, genre });
          }
        }
      }

      // Add/Update Director
      const director = await em.findOne(Person, { name: mData.director }) || em.create(Person, { name: mData.director });
      const existingMd = await em.findOne(MovieDirector, { movie: movie.id, director: director.id });
      if (!existingMd) {
        em.create(MovieDirector, { movie, director });
      }

      // Add/Update Cast
      for (const cData of mData.cast) {
        const person = await em.findOne(Person, { name: cData.name }) || em.create(Person, { name: cData.name });
        const existingMc = await em.findOne(MovieCast, { movie: movie.id, person: person.id });
        if (!existingMc) {
          em.create(MovieCast, { movie, person, roleName: cData.role });
        }
      }
    }
    
    await em.flush();
  }
}
