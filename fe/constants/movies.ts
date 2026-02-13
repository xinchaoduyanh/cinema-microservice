
export interface CastMember {
  name: string;
  role: string;
  image: string;
}

export interface Director {
  name: string;
  image: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  releaseDate: string;
  duration: string;
  genre: string[];
  rating: number;
  rottenTomatoes?: number;
  trailerUrl?: string;
  backdropUrl?: string;
  posterUrl?: string;
  accentColor?: string;
  status: "now-playing" | "coming-soon";
  previewVideoUrl?: string;
  cast: CastMember[];
  director: Director;
  stills: string[];
}

export const MOVIES: Movie[] = [
  {
    id: "1",
    title: "OPPENHEIMER",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    longDescription: "During World War II, Lt. Gen. Leslie Groves Jr. appoints physicist J. Robert Oppenheimer to work on the top-secret Manhattan Project. Oppenheimer and a team of scientists spend years developing and designing the atomic bomb. Their work comes to fruition on July 16, 1945, as they witness the world's first nuclear explosion, forever changing the course of history.",
    releaseDate: "2023-07-21",
    duration: "180 min",
    genre: ["Biography", "Drama", "History"],
    rating: 8.4,
    rottenTomatoes: 93,
    trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1&mute=1&loop=1&playlist=uYPbbksJxIg&controls=0&showinfo=0&rel=0",
    backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2000",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800",
    accentColor: "#f97316",
    status: "now-playing",
    previewVideoUrl: "https://www.youtube.com/embed/uRJQJcy3f8w?autoplay=1&mute=1&controls=0",
    director: {
      name: "Christopher Nolan",
      image: "https://images.unsplash.com/photo-1549474843-ed83443ba94a?auto=format&fit=crop&q=80&w=400"
    },
    cast: [
      { name: "Cillian Murphy", role: "J. Robert Oppenheimer", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
      { name: "Emily Blunt", role: "Kitty Oppenheimer", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
      { name: "Matt Damon", role: "Leslie Groves", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
      { name: "Robert Downey Jr.", role: "Lewis Strauss", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
      { name: "Florence Pugh", role: "Jean Tatlock", image: "https://images.unsplash.com/photo-1517841905240-472988bad19a?auto=format&fit=crop&q=80&w=400" },
      { name: "Josh Hartnett", role: "Ernest Lawrence", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
      { name: "Casey Affleck", role: "Boris Pash", image: "https://images.unsplash.com/photo-1539572622036-7dc308465719?auto=format&fit=crop&q=80&w=400" },
      { name: "Rami Malek", role: "David Hill", image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=400" },
      { name: "Kenneth Branagh", role: "Niels Bohr", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
      { name: "Benny Safdie", role: "Edward Teller", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" }
    ],
    stills: [
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "2",
    title: "DUNE: PART TWO",
    description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    longDescription: "Dune: Part Two will explore the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    releaseDate: "2024-03-01",
    duration: "166 min",
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 8.6,
    rottenTomatoes: 92,
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w?autoplay=1&mute=1&loop=1&playlist=Way9Dexny9w&controls=0&showinfo=0&rel=0",
    backdropUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=2000",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
    accentColor: "#d97706",
    status: "now-playing",
    previewVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-desert-sand-dunes-under-a-clear-blue-sky-40483-large.mp4",
    director: {
      name: "Denis Villeneuve",
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400"
    },
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400" },
      { name: "Zendaya", role: "Chani", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
      { name: "Rebecca Ferguson", role: "Lady Jessica", image: "https://images.unsplash.com/photo-1517841905240-472988bad19a?auto=format&fit=crop&q=80&w=400" },
      { name: "Javier Bardem", role: "Stilgar", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
      { name: "Josh Brolin", role: "Gurney Halleck", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
      { name: "Austin Butler", role: "Feyd-Rautha", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
      { name: "Florence Pugh", role: "Princess Irulan", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
      { name: "Dave Bautista", role: "Rabban", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
      { name: "Christopher Walken", role: "Emperor", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
      { name: "Léa Seydoux", role: "Lady Fenring", image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400" }
    ],
    stills: [
      "https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "3",
    title: "INTERSTELLAR",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    longDescription: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    releaseDate: "2014-11-07",
    duration: "169 min",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    rating: 8.7,
    rottenTomatoes: 73,
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&mute=1&loop=1&playlist=zSWdZVtXT7E&controls=0&showinfo=0&rel=0",
    backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2000",
    posterUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800",
    accentColor: "#3b82f6",
    status: "now-playing",
    previewVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-45811-large.mp4",
    director: {
      name: "Christopher Nolan",
      image: "https://images.unsplash.com/photo-1549474843-ed83443ba94a?auto=format&fit=crop&q=80&w=400"
    },
    cast: [
      { name: "Matthew McConaughey", role: "Cooper", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
      { name: "Anne Hathaway", role: "Brand", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
      { name: "Jessica Chastain", role: "Murph", image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400" },
      { name: "Michael Caine", role: "Professor Brand", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
      { name: "Casey Affleck", role: "Tom", image: "https://images.unsplash.com/photo-1539572622036-7dc308465719?auto=format&fit=crop&q=80&w=400" },
      { name: "Wes Bentley", role: "Doyle", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
      { name: "Topher Grace", role: "Getty", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
      { name: "John Lithgow", role: "Donald", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
      { name: "Ellen Burstyn", role: "Murph (Old)", image: "https://images.unsplash.com/photo-1544717305-27a734ef1904?auto=format&fit=crop&q=80&w=400" },
      { name: "Matt Damon", role: "Mann", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" }
    ],
    stills: [
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536440136628-8499c177e76a1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "7",
    title: "INCEPTION",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    longDescription: "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved. Now Cobb is being offered a chance at redemption. One last job could give him his life back but only if he can accomplish the impossible, inception.",
    releaseDate: "2010-07-16",
    duration: "148 min",
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 8.8,
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0?autoplay=1&mute=1&loop=1&playlist=YoHD9XEInc0&controls=0&showinfo=0&rel=0",
    backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2000",
    posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=800",
    accentColor: "#ef4444",
    status: "now-playing",
    previewVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-ink-smoke-in-water-455-large.mp4",
    director: {
      name: "Christopher Nolan",
      image: "https://images.unsplash.com/photo-1549474843-ed83443ba94a?auto=format&fit=crop&q=80&w=400"
    },
    cast: [
      { name: "Leonardo DiCaprio", role: "Cobb", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
      { name: "Joseph Gordon-Levitt", role: "Arthur", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
      { name: "Elliot Page", role: "Ariadne", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
      { name: "Tom Hardy", role: "Eames", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
      { name: "Ken Watanabe", role: "Saito", image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400" },
      { name: "Dileep Rao", role: "Yusuf", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
      { name: "Cillian Murphy", role: "Fischer", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
      { name: "Tom Berenger", role: "Browning", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
      { name: "Marion Cotillard", role: "Mal", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
      { name: "Michael Caine", role: "Miles", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" }
    ],
    stills: [
      "https://images.unsplash.com/photo-1536440136628-8499c177e76a1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "8",
    title: "THE DARK KNIGHT",
    description: "Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    longDescription: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseDate: "2008-07-18",
    duration: "152 min",
    genre: ["Action", "Crime", "Drama"],
    rating: 9.0,
    trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY?autoplay=1&mute=1&loop=1&playlist=EXeTwQWrcwY&controls=0&showinfo=0&rel=0",
    backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=2000",
    posterUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800",
    accentColor: "#111827",
    status: "now-playing",
    previewVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-dark-clouds-in-the-sky-at-night-45815-large.mp4",
    director: {
      name: "Christopher Nolan",
      image: "https://images.unsplash.com/photo-1549474843-ed83443ba94a?auto=format&fit=crop&q=80&w=400"
    },
    cast: [
      { name: "Christian Bale", role: "Bruce Wayne / Batman", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
      { name: "Heath Ledger", role: "Joker", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
      { name: "Aaron Eckhart", role: "Harvey Dent", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
      { name: "Michael Caine", role: "Alfred", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
      { name: "Gary Oldman", role: "Jim Gordon", image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400" },
      { name: "Morgan Freeman", role: "Lucius Fox", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
      { name: "Maggie Gyllenhaal", role: "Rachel Dawes", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
      { name: "Eric Roberts", role: "Maroni", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
      { name: "Chin Han", role: "Lau", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
      { name: "Nestor Carbonell", role: "Mayor", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" }
    ],
    stills: [
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536440136628-8499c177e76a1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "4",
    title: "GLADIATOR II",
    description: "Years after witnessing the death of the revered hero Maximus, Lucius is forced to enter the Colosseum.",
    longDescription: "From legendary director Ridley Scott, Gladiator II continues the epic saga of power, intrigue, and vengeance set in Ancient Rome. Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist. With rage in his heart and the fate of the Empire at stake, Lucius must look to his past to find strength and honor to return the glory of Rome to its people.",
    releaseDate: "2024-11-22",
    duration: "148 min",
    genre: ["Action", "Adventure", "Drama"],
    rating: 7.0,
    rottenTomatoes: 72,
    trailerUrl: "https://www.youtube.com/embed/4rgYUipGJNo?autoplay=1&mute=1&loop=1&playlist=4rgYUipGJNo&controls=0&showinfo=0&rel=0",
    backdropUrl: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=2000",
    posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=800",
    accentColor: "#991b1b",
    status: "coming-soon",
    director: {
      name: "Ridley Scott",
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400"
    },
    cast: [
      { name: "Paul Mescal", role: "Lucius", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400" },
      { name: "Pedro Pascal", role: "Marcus Acacius", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
      { name: "Joseph Quinn", role: "Emperor Geta", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
      { name: "Denzel Washington", role: "Macrinus", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
      { name: "Connie Nielsen", role: "Lucilla", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
      { name: "Fred Hechinger", role: "Emperor Caracalla", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&get=80&w=400" },
      { name: "Derek Jacobi", role: "Senator Gracchus", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
      { name: "Tim McInnerny", role: "Thraex", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
      { name: "Alexander Karim", role: "Ravi", image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400" },
      { name: "Rory McCann", role: "Tegula", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" }
    ],
    stills: [
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536440136628-8499c177e76a1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "5",
    title: "JOKER: FOLIE À DEUX",
    description: "Failed comedian Arthur Fleck meets the love of his life, Harley Quinn.",
    longDescription: "Joker: Folie à Deux finds Arthur Fleck institutionalized at Arkham awaiting trial for his crimes as Joker. While struggling with his dual identity, Arthur not only stumbles upon true love, but also finds the music that's always been inside him.",
    releaseDate: "2024-10-04",
    duration: "138 min",
    genre: ["Crime", "Drama", "Thriller"],
    rating: 5.3,
    rottenTomatoes: 33,
    trailerUrl: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1&loop=1&playlist=_OKAwz2MsJs&controls=0&showinfo=0&rel=0",
    backdropUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=2000",
    posterUrl: "https://images.unsplash.com/photo-1533230393046-27367e9cd133?auto=format&fit=crop&q=80&w=800",
    accentColor: "#7e22ce",
    status: "coming-soon",
    director: {
      name: "Todd Phillips",
      image: "https://images.unsplash.com/photo-1549474843-ed83443ba94a?auto=format&fit=crop&q=80&w=400"
    },
    cast: [
      { name: "Joaquin Phoenix", role: "Arthur Fleck / Joker", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
      { name: "Lady Gaga", role: "Harleen 'Lee' Quinzel", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
      { name: "Brendan Gleeson", role: "Jackie Sullivan", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
      { name: "Catherine Keener", role: "Maryanne Stewart", image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400" },
      { name: "Zazie Beetz", role: "Sophie Dumond", image: "https://images.unsplash.com/photo-1517841905240-472988bad19a?auto=format&fit=crop&q=80&w=400" },
      { name: "Steve Coogan", role: "Dr. Stewart", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
      { name: "Harry Lawtey", role: "Harvey Dent", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
      { name: "Ken Leung", role: "Dr. Liu", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
      { name: "Jacob Lofland", role: "Arkham Inmate", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400" },
      { name: "Bill Camp", role: "Garrity", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" }
    ],
    stills: [
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1533230393046-27367e9cd133?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536440136628-8499c177e76a1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=800"
    ]
  },
];
