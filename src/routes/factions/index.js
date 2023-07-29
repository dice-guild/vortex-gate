import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BugReportIcon from "@mui/icons-material/BugReport";
import RefreshIcon from "@mui/icons-material/Refresh";
import UploadIcon from "@mui/icons-material/Upload";
import InfoIcon from "@mui/icons-material/Info";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import CustomCircularProgress from "components/CustomCircularProgress";
import { Dropdown } from "components/dropdown";
import { DataContext, useModal } from "hooks";
import { get, omitBy } from "lodash";
import { set } from "lodash/fp";
import { useSnackbar } from "notistack";
import React, { useContext } from "react";
import { useParams } from "react-router";
import { ShowInfo } from "routes/modals";
import { DataAPI, mergeGlobalData } from "utils/data";
import { readFileContent } from "utils/files";
import { Factions } from "./factions";
import { PrettyHeader } from "components/pretty-header";

const FactionsMain = () => {
  const { gameName } = useParams();
  const [
    {
      data: nope,
      coreData,
      fetchGame,
      setData,
      refreshAllData: refreshData,
      isLoading,
      appState,
      setAppState,
      userPrefs,
    },
  ] = useContext(DataContext);
  const nameFilter = appState?.searchText;

  const fileDialog = React.useRef();
  // const navigate = useNavigate();
  const handleClick = () => {
    fileDialog.current.click();
  };
  const game = get(nope, `gameData`, {});
  const coreGame = get(coreData, `gameData`, {});
  React.useEffect(() => {
    if (!game.factions || (!coreGame.factions && !isLoading)) {
      fetchGame(gameName);
    }
  }, [
    coreData,
    coreGame.factions,
    fetchGame,
    game.factions,
    gameName,
    isLoading,
  ]);
  const globalData = mergeGlobalData(game, nope);
  const data = DataAPI(game, globalData);
  const { enqueueSnackbar } = useSnackbar();
  const uploadFile = (event) => {
    uploadFaction(event);
  };
  const uploadFaction = (event) => {
    const file = get(event, "target.files[0]");
    if (file) {
      readFileContent(file)
        .then((content) => {
          let armyObject = {};
          try {
            armyObject = JSON.parse(content);
          } catch (e) {
            return Promise.reject(e);
          }
          if (armyObject.games) {
            const newArmyData = {
              ...armyObject,
            };
            setCustomData(newArmyData);
            enqueueSnackbar(`Core data successfully imported.`, {
              appearance: "success",
            });
          } else if (armyObject.factions) {
            const newData = set(
              `games[${gameName}]`,
              { ...get(nope, `customData.games[${gameName}]`), ...armyObject },
              get(nope, "customData", {})
            );
            setCustomData(newData);
            enqueueSnackbar(`Core data successfully imported.`, {
              appearance: "success",
            });
          } else if (armyObject.id) {
            const newData = set(
              `games[${gameName}].factions[${armyObject.id}]`,
              {
                ...get(`games[${gameName}].factions[${armyObject.id}]`, {}),
                ...armyObject,
              },
              get(nope, "customData", {})
            );
            setCustomData(newData);
            enqueueSnackbar(`${armyObject.name} successfully imported.`, {
              appearance: "success",
            });
          } else {
            enqueueSnackbar(`Faction failed to find data to import.`, {
              appearance: "error",
            });
          }
        })
        .catch((error) => {
          enqueueSnackbar(`Faction failed to import. ${error.message}`, {
            appearance: "error",
          });
        });
    }
    fileDialog.current.value = null;
  };
  const deleteFaction = (factionId) => {
    const newFactionList = omitBy(
      get(nope, `customData.games[${gameName}].factions`, {}),
      (faction) => faction.id === factionId
    );
    const armyData = {
      ...get(nope, "customData", {}),
      games: {
        ...get(nope, "customData.games", {}),
        [gameName]: {
          ...get(nope, `customData.games[${gameName}]`, {}),
          factions: newFactionList,
        },
      },
    };
    enqueueSnackbar(
      `${data.getFaction(factionId).name} successfully deleted.`,
      {
        appearance: "success",
      }
    );
    setCustomData(armyData);
  };
  const refreshFactions = () => {
    refreshData(gameName)
      .then(() => {
        enqueueSnackbar(`Game data successfully updated.`, {
          appearance: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar(`Game failed to fetch factions. ${error.message}`, {
          appearance: "error",
        });
      });
  };
  const setCustomData = (passedData) => {
    const newGameData = {
      ...coreData,
      customData: {
        ...get(nope, "customData", {}),
        ...passedData,
      },
    };
    setData(newGameData);
  };
  const [showShowInfo, hideShowInfo] = useModal(
    ({ extraProps }) => (
      <ShowInfo
        hideModal={hideShowInfo}
        contextTitle={"Game Details"}
        author={game?.author}
        version={game?.version}
        id={game?.id}
        {...extraProps}
      />
    ),
    []
  );
  React.useEffect(() => {
    setAppState({
      enableSearch: true,
      contextActions: [
        {
          name: "Refresh",
          icon: <RefreshIcon />,
          onClick: () => refreshFactions(),
        },
        ...(!!userPrefs.developerMode
          ? [
              {
                name: "Import",
                icon: <UploadIcon />,
                onClick: () => handleClick(),
              },
            ]
          : []),
        ...(!!game.reportUrl
          ? [
              {
                name: "Report",
                icon: <BugReportIcon />,
                onClick: () => window.open(game.reportUrl, "_blank"),
              },
            ]
          : []),
        {
          name: "Details",
          icon: <InfoIcon />,
          onClick: () => showShowInfo(),
        },
      ],
    });
    return () => {
      setAppState({
        contextActions: [],
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPrefs.developerMode]);
  // const [dialOpen, setDialOpen] = React.useState(false);
  if (!data) {
    return (
      <Box sx={{ textAlign: "center" }}>
        <CustomCircularProgress />
        <input
          id="file-Form.Control"
          type="file"
          name="name"
          multiple
          ref={fileDialog}
          onChange={uploadFile}
          style={{ height: "0px", overflow: "hidden" }}
        />
      </Box>
    );
  }
  const isModified = Object.values(
    get(nope, `customData.games[${gameName}]`, {})
  ).length;
  return (
    <>
      <PrettyHeader
        text={
          <>
            {!!isModified && (
              <Dropdown>
                {({ handleClose, open, handleOpen, anchorElement }) => (
                  <>
                    <span
                      aria-haspopup="true"
                      onMouseEnter={handleOpen}
                      onMouseLeave={handleClose}
                      style={{ marginRight: "5px" }}
                    >
                      <FontAwesomeIcon size="sm" icon={faExclamationCircle} />
                    </span>
                    <Popover
                      variant="warning"
                      id="mouse-over-popover"
                      sx={{
                        pointerEvents: "none",
                      }}
                      open={open}
                      anchorEl={anchorElement}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      onClose={handleClose}
                      disableRestoreFocus
                    >
                      <Typography sx={{ p: 1 }}>
                        Warning: Data Is Modified Locally
                      </Typography>
                    </Popover>
                  </>
                )}
              </Dropdown>
            )}
            {"Factions"}
            {/* <small style={{ marginLeft: '5px', fontSize: '1rem' }}> {game.version ? `(${game.version})` : ""}</small> */}
          </>
        }
      />
      <Container>
        <Factions
          data={data}
          game={game}
          gameName={gameName}
          setData={setData}
          rawData={nope}
          userPrefs={userPrefs}
          deleteFaction={deleteFaction}
          nameFilter={nameFilter}
        />
        <input
          id="file-Form.Control"
          type="file"
          name="name"
          multiple
          ref={fileDialog}
          onChange={uploadFile}
          style={{ height: "0px", overflow: "hidden" }}
        />
      </Container>
    </>
  );
};

export default FactionsMain;
