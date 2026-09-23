import React, { useState } from 'react';
import { Minus, Plus, Flame, CheckCircle, ShoppingBag } from 'lucide-react';
import type { MealItem, MealOption } from './mealsData';
import { Modal } from '../../common/components/Modal/Modal';
import { ImageWithFallback } from '../../common/components/ImageWithFallback/ImageWithFallback';
import { Button } from '../../common/components/Button/Button';
import { getMealImage } from '../../utils/imageRegistry';
import { formatSYP } from '../../utils/currency';
import { useLanguage } from '../../app/providers/LanguageProvider';
import './MealDetailModal.css';

export interface MealDetailModalProps {
  meal: MealItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (item: {
    meal: MealItem;
    option: MealOption | null;
    spiciness: string;
    quantity: number;
    instructions: string;
    totalPrice: number;
  }) => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  meal,
  isOpen,
  onClose,
  onAddToOrder,
}) => {
  const { language, t } = useLanguage();

  const [selectedOption, setSelectedOption] = useState<MealOption | null>(null);
  const [spiciness, setSpiciness] = useState<'mild' | 'medium' | 'extraSpicy'>('mild');
  const [quantity, setQuantity] = useState<number>(1);
  const [instructions, setInstructions] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Reset or set defaults when a new meal is opened
  React.useEffect(() => {
    if (meal) {
      setSelectedOption(meal.options.length > 0 ? meal.options[0] : null);
      setSpiciness(meal.isSpicy ? 'medium' : 'mild');
      setQuantity(1);
      setInstructions('');
      setIsSuccess(false);
    }
  }, [meal]);

  if (!meal) return null;

  const imageAsset = getMealImage(meal.imageKey);
  const title = language === 'ar' ? meal.nameAr : meal.nameEn;
  const description = language === 'ar' ? meal.descriptionAr : meal.descriptionEn;
  const ingredients = language === 'ar' ? meal.ingredientsAr : meal.ingredientsEn;

  const basePrice = meal.price;
  const optionDiff = selectedOption ? selectedOption.priceDiff : 0;
  const unitPrice = Math.max(0, basePrice + optionDiff);
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    onAddToOrder({
      meal,
      option: selectedOption,
      spiciness,
      quantity,
      instructions,
      totalPrice,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="meal-detail-container">
        <div className="meal-detail-hero">
          <ImageWithFallback
            src={imageAsset.src}
            webpSrc={imageAsset.webp}
            alt={language === 'ar' ? imageAsset.altAr : imageAsset.altEn}
            containerClassName="h-full"
          />
        </div>

        <div className="meal-detail-body">
          <div className="meal-detail-title-row">
            <div>
              <h2 className="meal-detail-title">{title}</h2>
              <p className="meal-detail-desc">{description}</p>
            </div>
          </div>

          {/* Key Ingredients */}
          {ingredients.length > 0 && (
            <div>
              <h4 className="meal-detail-section-title">{t.menu.modal.ingredients}</h4>
              <div className="meal-ingredients-tags">
                {ingredients.map((ing, i) => (
                  <span key={i} className="ingredient-tag">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Options / Sizes */}
          {meal.options.length > 0 && (
            <div>
              <h4 className="meal-detail-section-title">{t.menu.modal.chooseSize}</h4>
              <div className="meal-options-group">
                {meal.options.map((opt) => {
                  const isSelected = selectedOption?.id === opt.id;
                  const optName = language === 'ar' ? opt.nameAr : opt.nameEn;
                  return (
                    <div
                      key={opt.id}
                      className={`meal-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedOption(opt)}
                    >
                      <span className="meal-option-name">{optName}</span>
                      {opt.priceDiff !== 0 && (
                        <span className="meal-option-diff">
                          {opt.priceDiff > 0 ? '+' : ''}
                          {formatSYP(opt.priceDiff, { locale: language })}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spice Level */}
          <div>
            <h4 className="meal-detail-section-title">
              <Flame size={16} className="text-crimson-500" />
              {t.menu.modal.spiciness}
            </h4>
            <div className="spice-selector">
              {(['mild', 'medium', 'extraSpicy'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`spice-btn ${spiciness === level ? 'selected' : ''}`}
                  onClick={() => setSpiciness(level)}
                >
                  {t.menu.modal.spicinessOptions[level]}
                </button>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <h4 className="meal-detail-section-title">
              {t.menu.modal.specialInstructions}
            </h4>
            <textarea
              className="special-instructions-input"
              placeholder={t.menu.modal.instructionsPlaceholder}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          {/* Quantity & Total Price Footer */}
          <div className="meal-detail-footer">
            <div className="quantity-picker">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="qty-display">{quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="meal-detail-total">
              {formatSYP(totalPrice, { locale: language })}
            </div>

            <Button
              variant={isSuccess ? 'secondary' : 'primary'}
              leftIcon={
                isSuccess ? (
                  <CheckCircle size={18} className="text-emerald-500" />
                ) : (
                  <ShoppingBag size={18} />
                )
              }
              onClick={handleConfirm}
              disabled={isSuccess}
            >
              {isSuccess ? t.menu.modal.addedSuccess : t.common.actions.addToOrder}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
