import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import { getTextColor, hexToRgb } from "utils/colors";

export const PowerCard = (props) => {
  const { faction, power } = props;
  const theme = useTheme();
  const { color: factionColor } = faction;
  const textColor = factionColor
    ? getTextColor(hexToRgb(factionColor))
    : "white";
  return (
    <Card
      className="no-break"
      sx={{
        border: `2px solid ${theme.palette.primary.main}`,
        mb: 2,
      }}
    >
      <CardHeader
        sx={{ py: 1, background: theme.palette.primary.main }}
        title={
          <Typography variant="h5" component="div">
            {power.name}{" "}
            <small style={{ fontSize: "1rem" }}>{`(${power.charge})`}</small>
          </Typography>
        }
      />
      <CardContent>
        {!!power.flavor && (
          <>
            <i className="power-flavor">{power.flavor}</i>
            <Divider />
          </>
        )}
        <div className="power-description">
          <ReactMarkdown children={power.description} className="rule-text" />
        </div>
        {!!power.source && (
          <>
            <Divider />
            <i className="power-source">{power.source}</i>
          </>
        )}
      </CardContent>
    </Card>
  );
};
