import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import RefreshIcon from "@mui/icons-material/Refresh";
import CodeIcon from "@mui/icons-material/Code";
import SwordCrossIcon from "mdi-material-ui/SwordCross";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import logo from "assets/vortex_gate_wide.png";
import React from "react";
import ChessPawn from "mdi-material-ui/ChessPawn";
import { useNavigate } from "react-router";
import { colors } from "utils/colors";
import bgImage from "assets/background.jpg";
import bgImage2 from "assets/background2.jpg";
import bgImage3 from "assets/background3.jpg";
import library from "assets/library.png";
import armory from "assets/armory.png";
import posters from "assets/soldiers.png";
import { DataContext } from "hooks";
import { useContext } from "react";
import { useSnackbar } from "notistack";
import Discord from "mdi-material-ui/Discord";

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [{ refreshAllData: refreshData, setAppState }] =
    useContext(DataContext);
  const { enqueueSnackbar } = useSnackbar();
  const iconSize = "60px";
  const fullScreen = useMediaQuery(theme.breakpoints.up("md"));
  const CARDS = [
    {
      name: "Rules",
      background: library,
      text: "Read any of the core rules in their digital format here.",
      to: "/rules",
      icon: <MenuBookIcon style={{ fontSize: iconSize }} />,
      color: colors.red.import[800],
    },
    {
      name: "Factions",
      background: posters,
      text: "Browse all of the available game factions to play.",
      to: "/factions",
      icon: <SwordCrossIcon style={{ fontSize: iconSize }} />,
      color: colors.green.import[900],
    },
    {
      name: "Rosters",
      background: armory,
      text: "Create and browse rosters to use during your games.",
      to: "/lists",
      icon: <FeaturedPlayListIcon style={{ fontSize: iconSize }} />,
      color: colors.brown.import[500],
    },
  ];

  const refreshFactions = () => {
    refreshData()
      .then(() => {
        enqueueSnackbar(`Game data successfully updated.`, {
          appearance: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar(`Game data failed to refresh. ${error.message}`, {
          appearance: "error",
        });
      });
  };

  React.useEffect(() => {
    setAppState({
      enableSearch: false,
      contextActions: [
        {
          name: "Refresh",
          icon: <RefreshIcon />,
          onClick: () => {
            refreshFactions();
          },
        },
      ],
    });
    return () => {
      setAppState({
        contextActions: [],
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <Box
          sx={{ display: "flex", flexDirection: "column", mt: -2, py: 5 }}
          style={{ width: "100%", background: "rgba(0,0,0,0.4)" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img flex={1} className={"logo"} src={logo} alt="logo" />
          </Box>
        </Box>
      </div>
      <Container sx={{ my: fullScreen ? 10 : 4 }}>
        <Grid container rowSpacing={2} sx={{ mt: 0, mb: 0 }} columnSpacing={2}>
          {CARDS.map((card) => (
            <Grid item xs={12} sm={6} md={4}>
              <Card
                style={{
                  backgroundImage: `url(${card.background})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <CardActionArea
                  onClick={() =>
                    card.toAbs
                      ? window.open(card.toAbs, "_blank")
                      : navigate(card.to)
                  }
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                      textAlign="center"
                    >
                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        style={{ background: "rgb(0,0,0,0.95)", flex: 1 }}
                        spacing={1}
                        sx={{ mt: 25, p: 2 }}
                      >
                        <Box sx={{ mr: 1, color: theme.palette.primary.main }}>{card.icon}</Box>
                        <Stack>
                          <Typography
                            variant={fullScreen ? "h4" : "h5"}
                            component="div"
                            textAlign="left"
                          >
                            {card.name}
                          </Typography>
                          <Typography align="left">{card.text}</Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Box
        sx={{ py: fullScreen ? 18 : 0 }}
        style={{
          backgroundImage: `url(${bgImage3})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <Container style={{ background: "rgb(0,0,0,0.95)" }}>
          <Box sx={{ py: 2 }}>
            <Typography
              variant={fullScreen ? "h2" : "h3"}
              paragraph
              align={fullScreen ? "center" : "center"}
              sx={{
                mb: "0.5em",
                borderBottom: `5px solid ${theme.palette.primary.main}`,
              }}
            >
              Welcome to Vortex Gate
            </Typography>
            <Typography
              style={{ fontSize: 16 }}
              textAlign="center"
              variant="body1"
              paragraph
            >
              Vortex Gate is a tactical miniature wargame designed for either
              small clashes or large all out battles. It allows you to use any
              miniatures you like in our simple to learn but deep to master
              rules provide a fair set of rules for both competitive and casual
              players alike.
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Button
                style={{ color: "white", fontSize: 16, textTransform: 'none' }}
                variant="outlined"
                onClick={() =>
                  window.open("https://discord.com/invite/M9sets4", "_blank")
                }
              >
                <Discord sx={{ mr: 1 }} />
                Join the community
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      <Container sx={{ my: 5 }}>
        <Typography
          variant={fullScreen ? "h2" : "h3"}
          paragraph
          align={fullScreen ? "center" : "center"}
          sx={{
            mb: "0.5em",
            borderBottom: `5px solid ${theme.palette.primary.main}`,
          }}
        >
          Key Game Features
        </Typography>
        <Grid
          container
          rowSpacing={1}
          sx={{ mt: 2 }}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item md={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <div style={{ padding: "5px" }}>
                <ChessPawn
                  style={{
                    fontSize: "100px",
                    color: theme.palette.primary.main,
                  }}
                />
              </div>
              <Typography variant="h5" gutterBottom>
                Deep Strategy
              </Typography>
              <Typography style={{ fontSize: 16 }} paragraph>
                The rules employ alternating activations to keep both players
                engaged and a two action system to keep each unit activation
                dynamic and interesting.
              </Typography>
              <Typography style={{ fontSize: 16 }} paragraph>
                Our Shock-based morale system ensures that you will have to
                adapt to the changing battlefield and use your Leaders to their
                full effect to keep your units fighting at full efficiency.
                Crucially, these mechanics will rarely cause you to lose a
                unit's entire activation, only weaken them to avoid frustration.
              </Typography>
            </Box>
          </Grid>
          <Grid item md={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <div style={{ padding: "5px" }}>
                <PhoneAndroidIcon
                  style={{
                    fontSize: "100px",
                    color: theme.palette.primary.main,
                  }}
                />
              </div>
              <Typography variant="h5" gutterBottom>
                Living Rules
              </Typography>
              <Typography style={{ fontSize: 16 }} paragraph>
                The project lives here on its digital hub and is quickly and
                easily updated to ensure the latest rules and updates are
                available in one place without having to download additional FAQ
                and Errata documents.
              </Typography>
              <Typography style={{ fontSize: 16 }} paragraph>
                The digital hub is also designed to be used as a reference while
                playing and is mobile-friendly with all features available on
                both desktop and mobile devices.
              </Typography>
            </Box>
          </Grid>
          <Grid item md={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <div style={{ padding: "5px" }}>
                <CodeIcon
                  style={{
                    fontSize: "100px",
                    color: theme.palette.primary.main,
                  }}
                />
              </div>
              <Typography variant="h5" gutterBottom>
                Open-source
              </Typography>
              <Typography style={{ fontSize: 16 }} paragraph>
                All of our released game data and the app itself are fully open
                source to allow you to edit and suggest changes in the live
                game.
              </Typography>
              <Typography style={{ fontSize: 16 }} paragraph>
                The games are all about community-driven content and regular
                balance feedback. The tools we've created allow us to very
                rapidly make balance changes that will apply to all settings and
                datasheets as well as your custom ones so you get the latest
                adjustments quickly.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box
        sx={{ py: fullScreen ? 14 : 0 }}
        style={{
          backgroundImage: `url(${bgImage2})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <Container style={{ background: "rgb(0,0,0,0.95)" }}>
          <Box sx={{ py: 2 }}>
            <Typography
              variant={fullScreen ? "h2" : "h3"}
              paragraph
              align={fullScreen ? "center" : "center"}
              sx={{
                mb: "0.5em",
                borderBottom: `5px solid ${theme.palette.primary.main}`,
              }}
            >
              Battles in the Celestia Expanse
            </Typography>
            <Typography style={{ fontSize: 16 }} variant="body1" paragraph>
              In the distant future, in a war-torn galaxy known as the Celestia
              Expanse, countless planets and civilizations find themselves
              embroiled in a seemingly unending conflict. The Celestia Expanse
              was once a beacon of prosperity and interstellar cooperation, but
              it all changed when the enigmatic Vortex Gate appeared at its
              center. The Vortex Gate was a cosmic anomaly of immense power,
              emitting dark and corrupt energies that spread like a plague
              throughout the galaxy. At its heart lay an ancient and malevolent
              cosmic horror, dormant for eons but now awakened by the ambitions
              and conflicts of the various civilizations within the Celestia
              Expanse.
            </Typography>
            <Typography style={{ fontSize: 16 }} variant="body1" paragraph>
              Humanity, at the forefront of exploration and colonization, had
              formed the Stellar Vanguard, an elite interstellar marine force
              dedicated to safeguarding the galaxy from threats. The Vanguard
              stood as a symbol of hope and valor. Eager to harness the power of
              the Vortex Gate for the benefit of mankind, the Stellar Vanguard
              embarked on a daring mission to investigate the anomaly. Their
              intentions were noble, driven by the belief that understanding the
              gate's energies could provide an advantage against their enemies.
              However, their encounter with the Vortex Gate proved catastrophic.
              The corrupt cosmic horror within the gate saw an opportunity to
              spread its malevolence further and exploited the Vanguard's
              vulnerabilities. The dark energies of the Vortex Gate twisted
              their minds, turning the once-virtuous Stellar Vanguard into the
              malevolent and corrupted nightmarish beings, their souls and
              bodies twisted by darkness.
            </Typography>
            <Typography style={{ fontSize: 16 }} variant="body1" paragraph>
              The Vortex Gate is both a beacon of hope and a harbinger of
              destruction. Join the ranks of the valiant defenders or the
              ambitious conquerors in this breathtaking sci-fi saga, where the
              destiny of countless worlds depends on the outcome of the battle
              for the Celestia Expanse. Prepare for an adrenaline-pumping
              adventure that will challenge your wit, courage, and determination
              in the face of the unknown. Are you ready to seize your place in
              this war-torn cosmos and shape its destiny?
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
