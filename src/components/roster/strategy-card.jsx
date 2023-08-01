import { Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { getTextColor, hexToRgb } from 'utils/colors';

export const StrategyCard = (props) => {
  const { strategy, faction } = props;
  const { color: factionColor } = faction;
  const theme = useTheme();
  const textColor = factionColor
    ? getTextColor(hexToRgb(factionColor))
    : "white";
  return (
    <Card
      className="no-break"
      sx={{
        border: `2px solid ${theme.palette.primary.main}`
      }}
    >
      <CardHeader
        sx={{
          backgroundColor: theme.palette.primary.main,
          py: 1,
        }}
        title={
          <Typography variant="h5" component="div">
            {strategy.name} <small style={{ fontSize: '1rem'}}>{`(${strategy.cost})`}</small>
          </Typography>
        }
      />
      <CardContent>
        {!!strategy.flavor && (
          <>
            <i className="strategy-flavor">{strategy.flavor}</i>
            <Divider />
          </>
        )}
        <div className="strategy-description">
          <ReactMarkdown
            children={strategy.description}
            className="rule-text"
          />
        </div>
        {!!strategy.source && (
          <>
            <Divider />
            <i className="strategy-source">{strategy.source}</i>
          </>
        )}
      </CardContent>
    </Card>
  );
};
