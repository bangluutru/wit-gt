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
      className={`p-2.5 rounded-full transition-all duration-200 cursor-pointer ${
        isFavorite
          ? 'text-wit-red bg-wit-red-soft hover:bg-wit-red-soft-hover'
          : 'text-wit-text-tertiary hover:text-wit-red hover:bg-wit-red-soft/50'
      }`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`h-5 w-5 transition-transform duration-200 ${isFavorite ? 'scale-110' : ''}`}
        fill={isFavorite ? 'currentColor' : 'none'}
      />
    </button>
  );
}
