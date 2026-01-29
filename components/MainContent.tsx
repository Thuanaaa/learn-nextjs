'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Book {
    id: number;
    title: string;
    author: string;
    price: number;
    originalPrice?: number;
    coverImage: string;
    rating: number;
    reviews: number;
    stock: number;
    category: string;
}

interface Category {
    id: string;
    name: string;
    icon: string;
    count: number;
}

interface MainContentProps {
    categories: Category[];
    books: Book[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    searchQuery: string;
}

export default function MainContent({
    categories,
    books,
    selectedCategory,
    setSelectedCategory,
    searchQuery
}: MainContentProps) {
    const [loading, setLoading] = useState(false);

    // Filter books
    const filteredBooks = books.filter(book => {
        const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex gap-8">
                {/* Sidebar - Desktop */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <div className="glass-card p-6 sticky top-28 animate-slideRight">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="text-2xl">🗂️</span>
                            Danh mục
                        </h2>
                        <nav className="space-y-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white'
                                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="text-xl">{category.icon}</span>
                                        <span className="font-medium text-sm">{category.name}</span>
                                    </span>
                                    <span className="text-xs opacity-60">{category.count}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Mobile Category Dropdown */}
                {categories.length > 0 && (
                    <div className="md:hidden mb-6">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full glass-card px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:border-purple-500/50 transition-all outline-none"
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id} className="bg-gray-900">
                                    {category.icon} {category.name} ({category.count})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 min-h-[calc(100vh-200px)]">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 animate-fadeIn">
                        <Link href="/" className="hover:text-purple-400 transition-colors">Trang chủ</Link>
                        <span>/</span>
                        <span className="text-white">{categories.find(c => c.id === selectedCategory)?.name || 'Tất cả sách'}</span>
                    </div>

                    {/* Results Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-16 pb-4 animate-slideUp">
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-xl sm:text-2xl font-bold">
                                {categories.find(c => c.id === selectedCategory)?.name || 'Tất cả sách'}
                            </h2>
                            <span className="text-gray-500 text-sm sm:text-base">({filteredBooks.length})</span>
                        </div>

                        <select className="glass-card h-11 w-full sm:w-52 px-4 text-sm rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:border-purple-500/50 transition-all outline-none cursor-pointer mb-6">
                            <option value="newest" className="bg-gray-900 text-white">Mới nhất</option>
                            <option value="price-asc" className="bg-gray-900 text-white">Giá thấp đến cao</option>
                            <option value="price-desc" className="bg-gray-900 text-white">Giá cao đến thấp</option>
                            <option value="name" className="bg-gray-900 text-white">Tên A-Z</option>
                        </select>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">📚</div>
                            </div>
                        </div>
                    )}

                    {/* Books Grid */}
                    {!loading && (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-32">
                                {filteredBooks.map((book, index) => (
                                    <div
                                        key={book.id}
                                        className="glass-card group hover:scale-102 transition-all duration-300 overflow-hidden animate-slideUp flex flex-col"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        {/* Book Cover */}
                                        <div className="relative aspect-[3/4] overflow-hidden">
                                            <img
                                                src={book.coverImage}
                                                alt={book.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {book.originalPrice && (
                                                <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                                    -{Math.round((1 - book.price / book.originalPrice) * 100)}%
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                                <span className="text-yellow-400 text-sm">⭐</span>
                                                <span className="text-white text-xs font-semibold">{book.rating}</span>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                                <button className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all transform hover:scale-110">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all transform hover:scale-110">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Book Info */}
                                        <div className="p-4 flex flex-col flex-1">
                                            <h3 className="font-bold text-sm sm:text-base mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors min-h-[2.5rem]">
                                                {book.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-400 mb-3">{book.author}</p>

                                            <div className="mt-auto">
                                                <div className="flex items-baseline gap-2 mb-3">
                                                    <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                                        {book.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ
                                                    </span>
                                                    {book.originalPrice && (
                                                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                                                            {book.originalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button className="flex-1 btn-primary text-xs sm:text-sm py-2.5 sm:py-3 flex items-center justify-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        <span className="hidden sm:inline">Thêm vào giỏ</span>
                                                    </button>
                                                </div>

                                                {book.stock < 10 && (
                                                    <p className="text-xs text-orange-400 mt-2 flex items-center gap-1">
                                                        <span>⚠️</span>
                                                        Chỉ còn {book.stock} sản phẩm
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center items-center gap-2 mt-12 animate-fadeIn">
                                <button className="glass-card px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] h-11 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {[1, 2, 3, '...', 8].map((page, index) => (
                                    <button
                                        key={index}
                                        className={`min-w-[44px] h-11 rounded-xl font-semibold transition-all ${page === 1
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                                            : page === '...'
                                                ? 'glass-card cursor-default'
                                                : 'glass-card hover:bg-white/10'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button className="glass-card px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all min-w-[44px] h-11 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
