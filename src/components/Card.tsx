import classnames from "classnames";

interface ICardProps {
  card: any;
  flipped: boolean;
  found: boolean;
  flip: () => void;
}

export default function Card({ card, flipped, found, flip }: ICardProps) {
  return (
    <div
      className={classnames("card", {
        "card--flipped": flipped || found,
      })}
      onClick={flip}
    >
      <div
        className={classnames("card__face card__face--front", {
          "card__face--found": found,
        })}
      >
        <img className="w-3/4" src={`/images/${card.image}`} alt={card.image} />
      </div>
      <div className={classnames("card__face card__face--back")}></div>
    </div>
  );
}
