'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import Footer from '@/components/Footer';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - Categories
  const categories = [
    { id: 'all', name: 'Tất cả sách', icon: '📚', count: 8 },
    { id: 'programming', name: 'Lập trình', icon: '💻', count: 4 },
    { id: 'design', name: 'Thiết kế', icon: '🎨', count: 1 },
    { id: 'business', name: 'Kinh doanh', icon: '💼', count: 1 },
    { id: 'science', name: 'Tâm lý học', icon: '🧠', count: 1 },
    { id: 'history', name: 'Lịch sử', icon: '📖', count: 1 },
  ];

  // Mock data - Books
  const books = [
    {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      price: 299000,
      originalPrice: 399000,
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
      rating: 4.8,
      reviews: 1234,
      stock: 50,
      category: 'programming'
    },
    {
      id: 2,
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt, David Thomas',
      price: 350000,
      originalPrice: 450000,
      coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
      rating: 4.9,
      reviews: 856,
      stock: 30,
      category: 'programming'
    },
    {
      id: 3,
      title: 'Design Patterns',
      author: 'Gang of Four',
      price: 450000,
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
      rating: 4.7,
      reviews: 654,
      stock: 20,
      category: 'programming'
    },
    {
      id: 4,
      title: "You Don't Know JS",
      author: 'Kyle Simpson',
      price: 280000,
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
      rating: 4.6,
      reviews: 432,
      stock: 40,
      category: 'programming'
    },
    {
      id: 5,
      title: 'Refactoring',
      author: 'Martin Fowler',
      price: 380000,
      originalPrice: 480000,
      coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
      rating: 4.8,
      reviews: 789,
      stock: 25,
      category: 'programming'
    },
    {
      id: 6,
      title: 'The Art of Computer Programming',
      author: 'Donald Knuth',
      price: 520000,
      coverImage: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&h=600&fit=crop',
      rating: 4.9,
      reviews: 567,
      stock: 15,
      category: 'programming'
    },
    {
      id: 7,
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      price: 320000,
      coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
      rating: 4.7,
      reviews: 923,
      stock: 35,
      category: 'science'
    },
    {
      id: 8,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      price: 290000,
      originalPrice: 350000,
      coverImage: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop',
      rating: 4.8,
      reviews: 1567,
      stock: 8,
      category: 'history'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="bg-decoration bg-decoration-2"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 animate-float blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500 rounded-full opacity-20 animate-float blur-3xl" style={{ animationDelay: '1s' }}></div>

      {/* Header */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Content */}
      <MainContent
        categories={categories}
        books={books}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
