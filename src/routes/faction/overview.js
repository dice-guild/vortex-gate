import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  CardHeader,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { get, sortBy } from "lodash";
import ReactMarkdown from "react-markdown";

export const Overview = (props) => {
  const { faction, nameFilter } = props;
  const theme = useTheme();
  const background = faction.background;
  const description = faction.description;
  const lore = faction.lore;
  const powers = get(faction, "buyLinks", []).filter((list) =>
    nameFilter
      ? list.name.toLowerCase().includes(nameFilter.toLowerCase())
      : true
  );
  const sortedPowers = sortBy(powers, (power) => power.name);
  return (
    <Box sx={{ mt: 2 }}>
      {!background && !description && !lore && !sortedPowers && (
        <div>
          <p>{`No information available...`}</p>
        </div>
      )}

      {!!description && (
        <Card
          sx={{
            border: `2px solid ${theme.palette.primary.main}`,
            mb: 2,
          }}
        >
          <CardHeader
            sx={{ py: 1, background: theme.palette.primary.main }}
            title={
              <Typography variant="h5" component="div">
                {"Overview"}
              </Typography>
            }
          />
          <CardContent>{description}</CardContent>
        </Card>
      )}
      {!!lore && (
        <Card
          sx={{
            border: `2px solid ${theme.palette.primary.main}`,
            mb: 2,
          }}
        >
          <CardHeader
            sx={{ py: 1, background: theme.palette.primary.main }}
            title={
              <Typography variant="h5" component="div">
                {"Lore Details"}
              </Typography>
            }
          />
          <CardContent style={{ paddingBottom: 0, paddingTop: 0 }}>
            <ReactMarkdown children={lore} />
          </CardContent>
        </Card>
      )}
      {!!sortedPowers && !!sortedPowers.length && (
        <Card
          sx={{
            m: 0,
            border: `2px solid ${theme.palette.primary.main}`,
          }}
        >
          <CardHeader
            sx={{ py: 1, background: theme.palette.primary.main }}
            title={
              <Typography variant="h5" component="div">
                {"Model Makers"}
              </Typography>
            }
          />
          <CardContent style={{ padding: 0 }}>
            {sortedPowers.map((list) => (
              <ListItem sx={{ p: 0 }} key={list.name}>
                <ListItemButton
                  onClick={() => window.open(list.link, "_blank")}
                >
                  <ListItemText
                    id={list.name}
                    primary={list.name}
                    secondary={list.description}
                  />
                  <ShoppingCartIcon />
                </ListItemButton>
              </ListItem>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
