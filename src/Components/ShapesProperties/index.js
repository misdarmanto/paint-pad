import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Divider } from "@mui/material";
import DesignBoard from "./DesignBoard";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import List from "@mui/material/List";
import { useContextApi } from "../../lib/hooks/useContexApi";

const ShapesProperties = ({ printComponentRef }) => {
  const theme = useTheme();
  const isOpenDrawer = useMediaQuery(theme.breakpoints.up("sm"));
  const drawerWidth = 300;
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
      variant="persistent"
      anchor="right"
      open={isOpenDrawer}
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <DesignBoard printComponentRef={printComponentRef} />
      </List>
    </Drawer>
  );
};

export default ShapesProperties;
