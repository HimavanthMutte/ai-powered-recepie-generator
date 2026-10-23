import { RefreshCw } from "lucide-react";
type Props = { count: number; imageUrl: string; onChangePhoto: () => void };
export default function IngredientPhoto({
  count,
  imageUrl,
  onChangePhoto,
}: Props) {
  return (
    <section className="photo-card">
      <img
        src={imageUrl}
        alt="Fresh eggs, spinach, tomatoes, basil, parmesan, garlic and olive oil on a marble counter"
      />
      <div className="photo-gradient" />
      <div className="photo-count">
        <span className="live-dot" />
        {count} ingredients detected
      </div>
      <button className="change-photo" onClick={onChangePhoto}>
        <RefreshCw size={15} /> Change or retake
      </button>
    </section>
  );
}
