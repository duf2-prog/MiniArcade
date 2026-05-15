import { useSelector } from "react-redux";
import type { RootState } from "../store/Store";
import { FormattedMessage } from "react-intl";

export default function GameSelector({
    value,
    onChange
}: {
    value: string;
    onChange: (v: string) => void;
}) {

    const games = useSelector((state: RootState) => state.games.games);

    return (
        <div>
            <h2 className="card-description">
                <FormattedMessage id="ranking.filterByGame" />:
            </h2>
            <select
                className="input-field mb-4"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
            >
                <option value="">
                    <FormattedMessage id="ranking.allGames" />
                </option>
                {games.map(g => (
                    <option key={g.id} value={g.id}>
                        <FormattedMessage id={`game.${g.id}.name`} />
                    </option>
                ))}
            </select>
        </div>
    );
}
