import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Flame, Award, UtensilsCrossed } from 'lucide-react';
import { getMeals } from './services/mealsService';
import type { MealItem, MealCategory } from './mealsData';
import { MealCard } from './MealCard';
import { MealDetailModal } from './MealDetailModal';
import { Pagination } from '../../common/components/Pagination/Pagination';
import { usePagination } from '../../common/hooks/usePagination';
import { useLanguage } from '../../app/providers/LanguageProvider';
import { useCart } from '../cart/hooks/useCart';
import './MenuGrid.css';

export const MenuGrid: React.FC = () => {
  const { t } = useLanguage();
  const { addItem } = useCart();

  const [meals, setMeals] = useState<MealItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<MealCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlySignature, setOnlySignature] = useState<boolean>(false);
  const [onlySpicy, setOnlySpicy] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'priceLow' | 'priceHigh' | 'popular'>('recommended');
  
  // Selected meal for detail modal
  const [activeMeal, setActiveMeal] = useState<MealItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    getMeals().then((res) => {
      if (isMounted) {
        setMeals(res.data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and sort items
  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      // Category filter
      if (selectedCategory !== 'all' && meal.category !== selectedCategory) {
        return false;
      }
      // Tag filters
      if (onlySignature && !meal.isSignature) return false;
      if (onlySpicy && !meal.isSpicy) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesNameAr = meal.nameAr.toLowerCase().includes(query);
        const matchesNameEn = meal.nameEn.toLowerCase().includes(query);
        const matchesDescAr = meal.descriptionAr.toLowerCase().includes(query);
        const matchesDescEn = meal.descriptionEn.toLowerCase().includes(query);
        return matchesNameAr || matchesNameEn || matchesDescAr || matchesDescEn;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount;
      return (b.rating || 0) - (a.rating || 0); // Default recommended
    });
  }, [meals, selectedCategory, onlySignature, onlySpicy, searchQuery, sortBy]);

  // Pagination with 6 items per page
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    setPage,
    pageNumbers,
  } = usePagination({
    totalItems: filteredMeals.length,
    itemsPerPage: 6,
  });

  const paginatedMeals = useMemo(() => {
    return filteredMeals.slice(startIndex, endIndex);
  }, [filteredMeals, startIndex, endIndex]);

  const categories: { key: MealCategory | 'all'; label: string }[] = [
    { key: 'all', label: t.menu.categories.all },
    { key: 'shawarma', label: t.menu.categories.shawarma },
    { key: 'broasted', label: t.menu.categories.broasted },
    { key: 'sandwiches', label: t.menu.categories.sandwiches },
    { key: 'towers', label: t.menu.categories.towers },
  ];

  return (
    <section id="menu-section" className="menu-section">
      <div className="container">
        {/* Section Header */}
        <div className="menu-section-header">
          <h2 className="menu-section-title">
            <span className="gold-gradient-text">{t.menu.sectionTitle}</span>
          </h2>
          <p className="menu-section-subtitle">{t.menu.sectionSubtitle}</p>
        </div>

        {/* Controls Bar */}
        <div className="menu-controls">
          {/* Category Tabs */}
          <div className="menu-category-tabs" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.key}
                className={`category-tab-btn ${selectedCategory === cat.key ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setPage(1);
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search, Tag Toggles & Sorting */}
          <div className="menu-filter-row">
            {/* Search Box */}
            <div className="menu-search-box">
              <span className="search-icon-pos">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="menu-search-input"
                placeholder={t.common.actions.search}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label={t.common.actions.clearSearch}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Quick Filters & Sort */}
            <div className="menu-sort-and-toggles">
              <button
                type="button"
                className={`menu-filter-toggle ${onlySignature ? 'active' : ''}`}
                onClick={() => {
                  setOnlySignature(!onlySignature);
                  setPage(1);
                }}
              >
                <Award size={15} />
                <span>{t.menu.filters.onlySignature}</span>
              </button>

              <button
                type="button"
                className={`menu-filter-toggle ${onlySpicy ? 'active' : ''}`}
                onClick={() => {
                  setOnlySpicy(!onlySpicy);
                  setPage(1);
                }}
              >
                <Flame size={15} />
                <span>{t.menu.filters.onlySpicy}</span>
              </button>

              {/* Sort Selector */}
              <select
                className="menu-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label={t.common.actions.sortBy}
              >
                <option value="recommended">{t.menu.sort.recommended}</option>
                <option value="priceLow">{t.menu.sort.priceLow}</option>
                <option value="priceHigh">{t.menu.sort.priceHigh}</option>
                <option value="popular">{t.menu.sort.popular}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Meals Grid or Loading / Empty State */}
        {isLoading ? (
          <div className="meals-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="meal-card skeleton-shimmer"
                style={{ height: '360px', borderRadius: 'var(--radius-xl)' }}
              />
            ))}
          </div>
        ) : filteredMeals.length === 0 ? (
          <div className="menu-empty-state">
            <UtensilsCrossed size={48} className="empty-state-icon" />
            <h3 className="empty-state-title">{t.menu.emptyState.title}</h3>
            <p className="empty-state-subtitle">{t.menu.emptyState.subtitle}</p>
          </div>
        ) : (
          <>
            <div className="meals-grid">
              {paginatedMeals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onSelect={(selected) => setActiveMeal(selected)}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              pageNumbers={pageNumbers}
            />
          </>
        )}

        {/* Meal Detail & Customization Modal */}
        <MealDetailModal
          meal={activeMeal}
          isOpen={Boolean(activeMeal)}
          onClose={() => setActiveMeal(null)}
          onAddToOrder={(orderItem) => {
            addItem({
              mealId: orderItem.meal.id,
              nameAr: orderItem.meal.nameAr,
              nameEn: orderItem.meal.nameEn,
              imageKey: orderItem.meal.imageKey,
              unitPrice: orderItem.meal.price + (orderItem.option?.priceDiff || 0),
              quantity: orderItem.quantity,
              selectedOption: orderItem.option,
              spiciness: orderItem.spiciness as any,
              instructions: orderItem.instructions,
            });
          }}
        />
      </div>
    </section>
  );
};
