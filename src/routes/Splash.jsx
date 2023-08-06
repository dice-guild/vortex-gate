import ExtensionIcon from "@mui/icons-material/Extension";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import RefreshIcon from "@mui/icons-material/Refresh";
import CodeIcon from "@mui/icons-material/Code";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import logo from "assets/vortex_gate_wide.png";
import Gallery from "components/gallery";
import { shuffle } from "lodash";
import React from "react";
import ChessPawn from "mdi-material-ui/ChessPawn";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router";
import { colors } from "utils/colors";
import { getHeaders } from "utils/images";
import { MaterialRenderer } from "utils/markdown";
import bgImage from "assets/background.jpg";
import { DataContext } from "hooks";
import { useContext } from "react";
import { useSnackbar } from "notistack";

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [{ refreshAllData: refreshData, setAppState }] =
    useContext(DataContext);
  const { enqueueSnackbar } = useSnackbar();
  const images = React.useMemo(() => shuffle(getHeaders()), []);
  const iconSize = "60px";
  const mrender = MaterialRenderer();
  const fullScreen = useMediaQuery(theme.breakpoints.up("md"));
  const CARDS = [
    {
      name: "Rules",
      icon: <MenuBookIcon style={{ fontSize: iconSize }} />,
      text: "Read any of the core rules in their digital format here.",
      to: "/rules",
      color: colors.red.import[800],
    },
    {
      name: "Factions",
      icon: <ExtensionIcon style={{ fontSize: iconSize }} />,
      text: "Browse all of the available game factions to play.",
      to: "/factions",
      color: colors.green.import[900],
    },
    {
      name: "Rosters",
      icon: <FeaturedPlayListIcon style={{ fontSize: iconSize }} />,
      text: "Create and browse rosters to use during your games.",
      to: "/lists",
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
          sx={{ display: "flex", flexDirection: "column", mt: -2 }}
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
      <Container>
        <Grid container rowSpacing={2} sx={{ mt: 1 }} columnSpacing={2}>
          {CARDS.map((card) => (
            <Grid item sm={6} md={4}>
              <Card>
                <CardActionArea
                  onClick={() =>
                    card.toAbs
                      ? window.open(card.toAbs, "_blank")
                      : navigate(card.to)
                  }
                >
                  <CardContent>
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box sx={{ mr: 2, color: theme.palette.primary.main }}>
                        {card.icon}
                      </Box>
                      <Stack>
                        <Typography variant="h4" component="div">
                          {card.name}
                        </Typography>
                        <Typography align="left">{card.text}</Typography>
                      </Stack>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Divider sx={{ pb: 2 }} />
      <Container>
        <Box sx={{ mt: 3 }}>
          <Typography
            variant={fullScreen ? "h1" : "h3"}
            paragraph
            align={fullScreen ? "center" : "left"}
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
            embroiled in a seemingly unending conflict. The Celestia Expanse was
            once a beacon of prosperity and interstellar cooperation, but it all
            changed when the enigmatic Vortex Gate appeared at its center. The
            Vortex Gate was a cosmic anomaly of immense power, emitting dark and
            corrupt energies that spread like a plague throughout the galaxy. At
            its heart lay an ancient and malevolent cosmic horror, dormant for
            eons but now awakened by the ambitions and conflicts of the various
            civilizations within the Celestia Expanse.
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
            vulnerabilities. The dark energies of the Vortex Gate twisted their
            minds, turning the once-virtuous Stellar Vanguard into the
            malevolent and corrupted nightmarish beings, their souls and bodies
            twisted by darkness.
          </Typography>
          <Typography style={{ fontSize: 16 }} variant="body1" paragraph>
            The Vortex Gate is both a beacon of hope and a harbinger of
            destruction. Join the ranks of the valiant defenders or the
            ambitious conquerors in this breathtaking sci-fi saga, where the
            destiny of countless worlds depends on the outcome of the battle for
            the Celestia Expanse. Prepare for an adrenaline-pumping adventure
            that will challenge your wit, courage, and determination in the face
            of the unknown. Are you ready to seize your place in this war-torn
            cosmos and shape its destiny?
          </Typography>
        </Box>
      </Container>
      <Divider sx={{ py: 2 }} />
      <Container>
        <Typography
          variant={fullScreen ? "h1" : "h3"}
          paragraph
          align={fullScreen ? "center" : "left"}
          sx={{
            mb: "0.5em",
            borderBottom: `5px solid ${theme.palette.primary.main}`,
          }}
        >
          Key Game Features
        </Typography>
        <Typography style={{ fontSize: 16 }} variant="body1" paragraph>
          Vortex Gate is a tactical miniature wargame designed for either small
          clashes or large all out battles. It allows you to use any miniatures
          you like in our simple to learn but deep to master rules provide a
          fair set of rules for both competitive and casual players alike.
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
                Strategic Gameplay
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
      <Divider sx={{ py: 2 }} />
      <Container>
        <Gallery
          images={images.map((img) => ({
            imgPath: `/images/headers/${img.img}`,
            label: (
              <ReactMarkdown
                components={mrender}
                className="rule-text"
                children={img.credit}
              />
            ),
          }))}
          maxHeight={500}
        />
      </Container>
    </>
  );
}