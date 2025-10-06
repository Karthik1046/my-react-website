require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const User = require('../models/User');

async function seedMovies() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set in config.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Find admin user to set as creator
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('❌ Admin user not found. Create an admin user first.');
      process.exit(1);
    }

    console.log(`🧑‍💼 Using admin user: ${adminUser.email}`);

    // Check if movies already exist
    const existingMovies = await Movie.countDocuments();
    if (existingMovies > 0) {
      console.log(`📽️ Database already has ${existingMovies} movies. Skipping seeding.`);
      process.exit(0);
    }

    console.log('🌱 Seeding initial movie data...');

    // Sample movies data
    const moviesData = [
      {
        title: 'Stranger Things',
        description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
        year: 2016,
        rating: 4.8,
        director: 'The Duffer Brothers',
        image: 'https://m.media-amazon.com/images/M/MV5BN2ZmYjg1YmItNWQ4OC00YWM0LTgyNmYtNzQ2ZGJhYzBiMzUxXkEyXkFqcGdeQXVyNjgxNTQ3Mjk@._V1_.jpg',
        genre: ['Drama', 'Fantasy', 'Horror'],
        category: 'tv-show',
        seasons: 4,
        createdBy: adminUser._id
      },
      {
        title: 'The Witcher',
        description: 'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.',
        year: 2019,
        rating: 4.5,
        director: 'Lauren Schmidt Hissrich',
        image: 'https://m.media-amazon.com/images/M/MV5BOGE4MmVjMDgtMzIzYy00NjEwLWJlODMtMDI1MGY2ZDlhMzE2XkEyXkFqcGdeQXVyMzY0MTE3NzU@._V1_.jpg',
        genre: ['Action', 'Adventure', 'Drama'],
        category: 'tv-show',
        seasons: 3,
        createdBy: adminUser._id
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        year: 2010,
        rating: 4.9,
        director: 'Christopher Nolan',
        duration: '2h 28m',
        image: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        category: 'movie',
        createdBy: adminUser._id
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        year: 2008,
        rating: 4.9,
        director: 'Christopher Nolan',
        duration: '2h 32m',
        image: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
        genre: ['Action', 'Crime', 'Drama'],
        category: 'movie',
        createdBy: adminUser._id
      },
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
        year: 2024,
        rating: 4.8,
        director: 'Denis Villeneuve',
        duration: '2h 46m',
        image: 'https://m.media-amazon.com/images/M/MV5BZGFiMWFhNDAtMzUyZS00NmQ2LTljNDYtMmZjNTc5MDUxMzViXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
        genre: ['Sci-Fi', 'Adventure', 'Drama'],
        category: 'trending',
        createdBy: adminUser._id
      },
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        year: 2023,
        rating: 4.8,
        director: 'Christopher Nolan',
        duration: '3h 0m',
        image: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg',
        genre: ['Biography', 'Drama', 'History'],
        category: 'trending',
        createdBy: adminUser._id
      }
    ];

    // Insert movies
    const insertedMovies = await Movie.insertMany(moviesData);
    console.log(`🎬 Successfully seeded ${insertedMovies.length} movies!`);

    // Show summary
    console.log('\n📊 SEEDED MOVIES SUMMARY:');
    console.log('==========================');
    
    const moviesByCategory = await Movie.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    moviesByCategory.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} movies`);
    });

    console.log('\n🎉 Seeding completed successfully!');
    console.log('You can now test the movie functionality in the frontend.');

  } catch (error) {
    console.error('❌ Error seeding movies:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
  }
}

seedMovies();