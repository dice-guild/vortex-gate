import {
  Box, Typography
} from "@mui/material";
import { StrategyCard } from "components/roster/strategy-card";
import { get, groupBy, sortBy } from "lodash";

export const Strategies = (props) => {
  const { data, faction, nameFilter } = props;
  const strategies = data
    .getStrategies(faction)
    .filter((strategy) =>
      nameFilter
        ? strategy.name.toLowerCase().includes(nameFilter.toLowerCase())
        : true
    );
  const phases = { ...data.getFaction(faction)?.subfactions };
  const unitPhases = { ...groupBy(strategies, (strategy) => strategy?.subfactions?.[0]) };
  const phaseOrder = [undefined,  ...Object.keys(phases)].filter(
    (cat) => unitPhases[cat] && unitPhases[cat]
  );
  return (
    <Box>
      {!strategies.length && <p>{"No strategies found..."}</p>}
      {phaseOrder.map((phaseId, phaseKey) => {
        const phaseStrategies = get(unitPhases, `[${phaseId}]`, []).map(
          (strat) => ({ ...strat, sourceLength: strat.source.length })
        );
        const sortedStrategies = sortBy(phaseStrategies, [
          "sourceLength",
          "source",
          "cost",
        ]);
        const phaseData = data.getSubfaction(faction, phaseId);
        console.log(phaseData);
        return (
          <>
            <div key={phaseKey} className="no-break">
              <Typography
                sx={{ my: 2 }}
                variant="h4"
                component="div"
                align="center"
              >
                {phaseData.name || "Faction"}
              </Typography>
            </div>
            <div className="two-columns">
              {sortedStrategies.map((strategy, index) => (
                <div key={index} className="no-break">
                  <Box sx={{ mb: 2 }}>
                    <StrategyCard faction={faction} strategy={strategy} />
                  </Box>
                </div>
              ))}
            </div>
          </>
        );
      })}
    </Box>
  );
};
