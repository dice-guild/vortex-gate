import { useState } from "react";
import { get } from "lodash";
import { RuleList } from "components/roster/rule-list";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { StyledTableRow } from "components/styled-table";
import {
  Box,
  ClickAwayListener,
  Tooltip,
  useTheme,
} from "@mui/material";
import { Dropdown } from "components/dropdown";
import ReactMarkdown from "react-markdown";

export const WeaponList = (props) => {
  const {
    weapons,
    faction,
    data,
    toggler,
    rules,
    twoColumns = true,
    printMode = false,
  } = props;
  const theme = useTheme();
  const borderColor = theme.palette.primary.main;
  const btnStyle = { borderColor };
  const thStyle = {
    backgroundColor: theme.palette.primary.main,
  };
  const [showWeapons, setShowWeapons] = useState(false);
  const renderRules = (rules) => {
    if (!rules || !rules.length) {
      return;
    }
    return (
      <div>
        <RuleList twoColumn={twoColumns} faction={faction} rules={rules} />
      </div>
    );
  };
  const renderRuleTooltip = (rule, ruleData) => {
    const ruleString = ruleData.inputs
      ? `${ruleData.name}(${ruleData.inputs
          .map((input) => rule[input])
          .join(", ")})`
      : ruleData.name;
    return (
      <Dropdown>
        {({ handleClose, open, handleOpen, anchorElement }) => (
          <>
            <ClickAwayListener onClickAway={handleClose}>
              <Tooltip
                arrow
                disableFocusListener
                disableHoverListener
                disableTouchListener
                className="clickable"
                onClose={handleClose}
                open={open}
                title={
                  <ReactMarkdown
                    className="rule-text font-16"
                    children={ruleData.description}
                  />
                }
                placement="top"
              >
                <Box
                  sx={{ pr: 1 }}
                  style={{ display: "inline", textDecoration: "underline" }}
                  onClick={handleOpen}
                >
                  {ruleString}
                </Box>
              </Tooltip>
            </ClickAwayListener>
          </>
        )}
      </Dropdown>
    );
  };
  return (
    <div>
      {!!toggler && (
        <div align="center">
          <div style={{ marginBottom: "0.5rem" }}>
            <Button
              sx={{ color: "inherit", textTransform: "none" }}
              size="small"
              fullWidth
              variant="outlined"
              style={btnStyle}
              onClick={() => setShowWeapons(!showWeapons)}
            >
              {showWeapons ? "Hide" : "Weapons"}
            </Button>
          </div>
        </div>
      )}
      <Collapse in={!toggler || showWeapons}>
        <TableContainer sx={{ borderRadius: "2px", mb: 1 }}>
          <Table size="small" style={{ borderColor: borderColor }}>
            <TableHead>
              <StyledTableRow style={thStyle}>
                <TableCell>{"Weapon"}</TableCell>
                <TableCell align="center">{"Range"}</TableCell>
                <TableCell align="center">{"A"}</TableCell>
                <TableCell align="center">{"AP"}</TableCell>
                <TableCell>{"Special"}</TableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {weapons.map((weapon) => {
                if (weapon.profiles) {
                  return weapon.profiles.map((weaponProfile) => {
                    return (
                      <StyledTableRow>
                        <TableCell>{`${weapon.name} (${weaponProfile.name})`}</TableCell>
                        <TableCell align="center">
                          {`${
                            weapon.short !== "Melee"
                              ? `${weaponProfile.short}"`
                              : weaponProfile.short || "-"
                          }/${
                            weaponProfile.medium
                              ? `${weaponProfile.medium}"`
                              : "-"
                          }`}
                        </TableCell>
                        <TableCell align="center">
                          {weaponProfile.attacks ? weaponProfile.attacks : "-"}
                        </TableCell>
                        <TableCell align="center">
                          {weaponProfile.ap || "-"}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexWrap="wrap">
                            {[
                              ...get(weapon, "rules", []),
                              ...get(weaponProfile, "rules", []),
                            ].map((rule) => {
                              const ruleData = data.getRule(
                                rule.id || rule,
                                faction
                              );
                              return renderRuleTooltip(rule, ruleData);
                            })}
                          </Box>
                        </TableCell>
                      </StyledTableRow>
                    );
                  });
                }
                return (
                  <StyledTableRow>
                    <TableCell>{weapon.name}</TableCell>
                    <TableCell align="center">
                      {`${
                        weapon.short !== "Melee"
                          ? `${weapon.short}"`
                          : weapon.short || "-"
                      }/${weapon.medium ? `${weapon.medium}"` : "-"}`}
                    </TableCell>
                    <TableCell align="center">
                      {weapon.attacks ? weapon.attacks : "-"}
                    </TableCell>
                    <TableCell align="center">{weapon.ap || "-"}</TableCell>
                    <TableCell>
                      <Box display="flex" flexWrap="wrap">
                        {get(weapon, "rules", []).map((rule) => {
                          const ruleData = data.getRule(
                            rule.id || rule,
                            faction
                          );
                          return renderRuleTooltip(rule, ruleData);
                        })}
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {!!(printMode && rules && rules.length) && <>{renderRules(rules)}</>}
      </Collapse>
    </div>
  );
};
