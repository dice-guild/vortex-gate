import {
  Box,
  Button,
  CardActionArea,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Card from "@mui/material/Card";
import { get, groupBy, sortBy } from "lodash";
import { useNavigate } from "react-router";
import { DataAPI } from "utils/data";
import "./factions.css";

export const Factions = (props) => {
  const { game, gameName, nameFilter, deleteFaction, userPrefs } = props;
  const navigate = useNavigate();
  const data = DataAPI(game);
  const alliances = data.getRawAlliances();
  const showBeta = userPrefs.showBeta;
  const theme = useTheme();
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
          <>
            <Card sx={{ my: 1 }}>
              <CardHeader
                sx={{ py: 2, background: theme.palette.primary.main }}
                title={
                  <Typography variant="h5">
                    {allianceData.name || "Unaligned"}
                  </Typography>
                }
              />
            </Card>
            <Grid container spacing={1}>
              {factions.map((faction, index) => {
                return (
                  <Grid item sm={12} md={6} lg={4}>
                    <Card sx={{ my: 1 }}>
                      <CardActionArea onClick={() => goToFaction(faction)}>
                        {!!faction.image && (
                          <CardMedia
                            sx={{ height: 250 }}
                            image={faction.image}
                            title="green iguana"
                          />
                        )}
                        <ListItem key={index} sx={{ px: 1, py: 0.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="h6" component="div">
                                {faction.name}
                              </Typography>
                            }
                            secondary={faction.description || " "}
                          />
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
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
        );
      })}
    </>
  );
};
