import { Heart } from 'lucide-react';

interface Props {
  isFavorite: boolean;
  onToggle: () => void;
}

export function FavoriteButton({ isFavorite, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center justify-center w-[38px] h-[38px] rounded-button hover:bg-wit-surface-2 transition-all duration-200 cursor-pointer ${
        isFavorite ? 'text-wit-red' : 'text-wit-text-tertiary hover:text-wit-text'
      }`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`h-[19px] w-[19px] transition-transform duration-200 ${isFavorite ? 'scale-110' : ''}`}
        fill={isFavorite ? 'currentColor' : 'none'}
      />
    </button>
  );
}
