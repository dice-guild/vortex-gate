import {
  Button,
  CardActions,
  CardHeader,
  Collapse,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Card from "@mui/material/Card";
import { Dropdown } from "components/dropdown";
import { get, groupBy, sortBy } from "lodash";
import { useNavigate } from "react-router";
import { DataAPI } from "utils/data";
import "./factions.css";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export const Factions = (props) => {
  const { game, gameName, nameFilter, deleteFaction, userPrefs } = props;
  const navigate = useNavigate();
  const data = DataAPI(game);
  const alliances = data.getRawAlliances();
  const showBeta = userPrefs.showBeta;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up("md"));
  const factions = sortBy(
    data
      .getFactions(gameName)
      .filter((unit) =>
        nameFilter
          ? unit.name.toLowerCase().includes(nameFilter.toLowerCase())
          : true
      ),
    "name"
  ).filter((game) =>
    showBeta ? true : game.version && Number(game.version) >= 1
  );
  const unitCategories = groupBy(factions, "alliance");
  const categoryOrder = [...Object.keys(alliances), undefined].filter(
    (cat) => unitCategories[cat] && unitCategories[cat].length
  );
  const goToFaction = (faction) => navigate(`/factions/${faction.id}`);
  if (!data) {
    return <p>{"Ohai"}</p>;
  }
  return (
    <>
      {categoryOrder.map((allianceKey, index) => {
        const factions = get(unitCategories, `[${allianceKey}]`, []);
        const allianceData = data.getAlliance(allianceKey);
        return (
          <Card
            variant="outlined"
            sx={{ my: 2, border: `2px solid ${theme.palette.primary.main}` }}
            key={index}
          >
            <>
              <CardHeader
                sx={{ py: 1, background: theme.palette.primary.main }}
                title={
                  <Typography variant="h5">
                    {allianceData.name || "Unaligned"}
                  </Typography>
                }
              />
              {factions.map((faction, index) => {
                return (
                  <ListItem key={index} sx={{ p: 0 }}>
                    <ListItemButton onClick={() => goToFaction(faction)}>
                      <ListItemText
                        primary={
                          <Typography variant="h6" component="div">
                            {faction.name}
                          </Typography>
                        }
                        secondary={faction.description || " "}
                      />
                    </ListItemButton>
                    {!faction.url && (
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteFaction(game.id);
                          }}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    )}
                  </ListItem>
                );
              })}
            </>
          </Card>
        );
      })}
    </>
  );
};
